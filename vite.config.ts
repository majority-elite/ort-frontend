import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxyVitePlugin } from '@majority-elite/remix-dev-utils';
import { vitePlugin as remix } from '@remix-run/dev';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {
  type ContextEnv,
  getLoadContext,
  makeAuthSessionStorage,
} from './server';

export default defineConfig({
  plugins: [
    remixCloudflareDevProxyVitePlugin<ContextEnv, CfProperties>({
      getLoadContext: async (args) => {
        const authSessionStorage = await makeAuthSessionStorage({
          authCookieSessionSecret:
            args.context.cloudflare.env.AUTH_COOKIE_SESSION_SECRET,
          kvNamespace: args.context.cloudflare.env.KV_NAMESPACE,
        });
        const authSession = await authSessionStorage.getSession(
          args.request.headers.get('Cookie'),
        );
        const loadContext = await getLoadContext(
          authSession,
          () => authSessionStorage.commitSession(authSession),
          args,
        );
        return loadContext;
      },
      getResponse: async (req, loadContext, handler) => {
        const response = await handler(req, loadContext);
        response.headers.append(
          'Set-Cookie',
          await loadContext.commitSession(),
        );
        return response;
      },
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    vanillaExtractPlugin(),
  ],
});
