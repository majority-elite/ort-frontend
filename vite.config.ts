import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxyVitePlugin,
} from '@remix-run/dev';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { z } from 'zod';
import { type ContextEnv, envSchema, getLoadContext } from './server';

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), [
    'CLIENT_',
    'SERVER_',
    'SHARED_',
    'SENTRY_',
  ]);

  envSchema.parse(viteEnv);

  const configEnv = z
    .object({
      SENTRY_AUTH_TOKEN: z.string(),
    })
    .parse(viteEnv);

  return {
    envPrefix: ['CLIENT_', 'SERVER_', 'SHARED_'],
    plugins: [
      remixCloudflareDevProxyVitePlugin<ContextEnv, CfProperties>({
        getLoadContext: (args) =>
          getLoadContext(args, {
            authCookieSessionSecret: viteEnv.SERVER_AUTH_COOKIE_SESSION_SECRET,
          }),
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
      sentryVitePlugin({
        org: 'majority-elite',
        project: 'ort-frontend',
        url: 'https://sentry.io/',
        authToken: configEnv.SENTRY_AUTH_TOKEN,
      }),
    ],
    build: {
      sourcemap: true,
    },
  };
});
