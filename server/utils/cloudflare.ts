import {
  createCookie,
  createWorkersKVSessionStorage,
} from '@remix-run/cloudflare';
import { type GetLoadContextFunction } from '@remix-run/cloudflare-pages';
import { type PlatformProxy } from 'wrangler';
import { clientEnvSchema, serverEnvSchema } from '../constants/env';
import type { AuthSession, AuthSessionData } from '../types/auth';
import type {
  ClientEnv,
  CloudflareEnv,
  ContextEnv,
  ServerEnv,
} from '../types/env';

declare module '@remix-run/cloudflare' {
  interface AppLoadContext extends ServerEnv, CloudflareEnv {
    readonly clientEnv: ClientEnv;
    readonly authSession: AuthSession;
    readonly commitSession: () => Promise<string>;
  }
}

export const getLoadContext: <Cf extends CfProperties>(
  authSession: AuthSession,
  commitSession: () => Promise<string>,
  args: {
    request: Request;
    context: {
      cloudflare: Omit<PlatformProxy<ContextEnv, Cf>, 'dispose'>;
    };
  },
) => ReturnType<GetLoadContextFunction<ContextEnv>> = async (
  authSession,
  commitSession,
  { context },
) => {
  const clientEnv = clientEnvSchema.parse(context.cloudflare.env);
  serverEnvSchema.parse(context.cloudflare.env);

  return {
    ...context.cloudflare.env,
    clientEnv,
    authSession,
    commitSession,
  };
};

export const makeAuthSessionStorage = async (env: {
  authCookieSessionSecret: string;
  kvNamespace: KVNamespace<string>;
}) => {
  const authSessionCookie = createCookie('__auth_session', {
    secrets: [env.authCookieSessionSecret],
    sameSite: true,
  });
  const authSessionStorage = createWorkersKVSessionStorage<AuthSessionData>({
    cookie: authSessionCookie,
    kv: env.kvNamespace,
  });

  return authSessionStorage;
};
