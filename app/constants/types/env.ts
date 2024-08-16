import type {
  LoaderFunctionArgs,
  LoaderFunction,
  SessionData,
  SessionStorage,
} from '@remix-run/cloudflare';

export interface Env {
  KV_NAMESPACE: KVNamespace<string>;
  AUTH_COOKIE_SESSION_SECRET: string;
}

export type LoaderFunctionWithContext = (
  args: LoaderFunctionArgs & {
    context: Env & {
      authSessionStorage: SessionStorage<SessionData, SessionData>;
    };
  },
) => ReturnType<LoaderFunction>;
