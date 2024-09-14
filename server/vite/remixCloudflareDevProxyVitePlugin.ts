// https://github.com/remix-run/remix/blob/main/packages/remix-dev/vite/cloudflare-proxy-plugin.ts

import { createRequestHandler, type ServerBuild } from '@remix-run/cloudflare';
import type * as Vite from 'vite';
import { type GetPlatformProxyOptions } from 'wrangler';
import type { ContextEnv } from '../types/env';
import { getLoadContext, makeAuthSession } from '../utils/cloudflare';

const serverBuildId = 'virtual:remix/server-build';

type CfProperties = Record<string, unknown>;

const NAME = 'vite-plugin-remix-cloudflare-proxy';

const remixCloudflareDevProxyVitePlugin = <Cf extends CfProperties>(
  options: GetPlatformProxyOptions = {},
): Vite.Plugin => ({
  name: NAME,
  config: () => ({
    ssr: {
      resolve: {
        externalConditions: ['workerd', 'worker'],
      },
    },
    // https://github.com/sveltejs/kit/issues/8140
    optimizeDeps: { exclude: ['fsevents'] },
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
    const [{ getPlatformProxy }, { fromNodeRequest, toNodeRequest }] =
      await Promise.all([
        import('wrangler'),
        // Node.js 의존성은  동적으로 import
        import('./nodeAdapter'),
      ]);
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

export default remixCloudflareDevProxyVitePlugin;
