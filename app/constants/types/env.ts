import type { LoaderFunctionArgs, LoaderFunction } from '@remix-run/cloudflare';
import type { AuthSessionStorage } from './auth';

export type Env = {
  KV_NAMESPACE: KVNamespace<string>;
  AUTH_COOKIE_SESSION_SECRET: string;
};

export type LoaderFunctionWithContext = (
  args: LoaderFunctionArgs & {
    context: Env & {
      authSessionStorage: AuthSessionStorage;
    };
  },
) => ReturnType<LoaderFunction>;
