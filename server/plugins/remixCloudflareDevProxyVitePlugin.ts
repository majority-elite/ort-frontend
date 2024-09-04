/**
 * `cloudflareDevProxyVitePlugin` 코드 원문을 가져와 수정
 * https://github.com/remix-run/remix/blob/main/packages/remix-dev/vite/cloudflare-proxy-plugin.ts
 */

import { once } from 'node:events';
import type { IncomingHttpHeaders, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { createRequestHandler, type ServerBuild } from '@remix-run/cloudflare';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { splitCookiesString } from 'set-cookie-parser';
import type * as Vite from 'vite';
import { type GetPlatformProxyOptions } from 'wrangler';
import type { ContextEnv } from '../constants/env';
import { getLoadContext, makeAuthSession } from '../utils/cloudflare';

function invariant(value: boolean, message?: string): asserts value;

function invariant<T>(
  value: T | null | undefined,
  message?: string,
): asserts value is T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function invariant(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    console.error(
      'The following error is a bug in Remix; please open an issue! https://github.com/remix-run/remix/issues/new',
    );
    throw new Error(message);
  }
}

function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers {
  const headers = new Headers();

  for (const [key, values] of Object.entries(nodeHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

// Based on `createRemixRequest` in packages/remix-express/server.ts
export function fromNodeRequest(
  nodeReq: Vite.Connect.IncomingMessage,
): Request {
  const origin =
    nodeReq.headers.origin && 'null' !== nodeReq.headers.origin
      ? nodeReq.headers.origin
      : `http://${nodeReq.headers.host}`;
  // Use `req.originalUrl` so Remix is aware of the full path
  invariant(
    nodeReq.originalUrl,
    'Expected `nodeReq.originalUrl` to be defined',
  );
  const url = new URL(nodeReq.originalUrl, origin);
  const init: RequestInit = {
    method: nodeReq.method,
    headers: fromNodeHeaders(nodeReq.headers),
  };

  if (nodeReq.method !== 'GET' && nodeReq.method !== 'HEAD') {
    init.body = createReadableStreamFromReadable(nodeReq);
    (init as { duplex: 'half' }).duplex = 'half';
  }

  return new Request(url.href, init);
}

// Adapted from solid-start's `handleNodeResponse`:
// https://github.com/solidjs/solid-start/blob/7398163869b489cce503c167e284891cf51a6613/packages/start/node/fetch.js#L162-L185
export async function toNodeRequest(res: Response, nodeRes: ServerResponse) {
  nodeRes.statusCode = res.status;
  nodeRes.statusMessage = res.statusText;

  const cookiesStrings = [];

  for (const [name, value] of res.headers) {
    if (name === 'set-cookie') {
      cookiesStrings.push(...splitCookiesString(value));
    } else nodeRes.setHeader(name, value);
  }

  if (cookiesStrings.length) {
    nodeRes.setHeader('set-cookie', cookiesStrings);
  }

  if (res.body) {
    // https://github.com/microsoft/TypeScript/issues/29867
    const responseBody = res.body as unknown as AsyncIterable<Uint8Array>;
    const readable = Readable.from(responseBody);
    readable.pipe(nodeRes);
    await once(readable, 'end');
  } else {
    nodeRes.end();
  }
}

const serverBuildId = 'virtual:remix/server-build';

type CfProperties = Record<string, unknown>;

function importWrangler() {
  try {
    return import('wrangler');
  } catch (_) {
    throw Error('Could not import `wrangler`. Do you have it installed?');
  }
}

const NAME = 'vite-plugin-remix-cloudflare-proxy';

export const remixCloudflareDevProxyVitePlugin = <Cf extends CfProperties>(
  options: GetPlatformProxyOptions = {},
): Vite.Plugin => ({
  name: NAME,
  config: () => ({
    ssr: {
      resolve: {
        externalConditions: ['workerd', 'worker'],
      },
    },
  }),
  configResolved: (viteConfig) => {
    const pluginIndex = (name: string) =>
      viteConfig.plugins.findIndex((plugin) => plugin.name === name);
    const remixIndex = pluginIndex('remix');
    if (remixIndex >= 0 && remixIndex < pluginIndex(NAME)) {
      throw new Error(
        `The "${NAME}" plugin should be placed before the Remix plugin in your Vite config file`,
      );
    }
  },
  configureServer: async (viteDevServer) => {
    const { getPlatformProxy } = await importWrangler();
    // Do not include `dispose` in Cloudflare context
    const { dispose: _dispose, ...cloudflare } = await getPlatformProxy<
      ContextEnv,
      Cf
    >(options);
    const context = { cloudflare };
    return () => {
      if (!viteDevServer.config.server.middlewareMode) {
        viteDevServer.middlewares.use(async (nodeReq, nodeRes, next) => {
          try {
            const build = (await viteDevServer.ssrLoadModule(
              serverBuildId,
            )) as ServerBuild;

            const handler = createRequestHandler(build, 'development');
            const req = fromNodeRequest(nodeReq);

            // auth session 생성
            const { authSessionStorage, authSession } = await makeAuthSession(
              {
                authCookieSessionSecret:
                  context.cloudflare.env.AUTH_COOKIE_SESSION_SECRET,
                kvNamespace: context.cloudflare.env.KV_NAMESPACE,
              },
              nodeReq.headers.cookie,
            );

            const loadContext = await getLoadContext(authSession, {
              request: req,
              context,
            });

            const res = await handler(req, loadContext);

            // 자동 commit
            res.headers.append(
              'Set-Cookie',
              await authSessionStorage.commitSession(authSession),
            );

            await toNodeRequest(res, nodeRes);
          } catch (error) {
            next(error);
          }
        });
      }
    };
  },
});
