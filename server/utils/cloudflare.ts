import {
  createCookie,
  createWorkersKVSessionStorage,
} from '@remix-run/cloudflare';
import { type GetLoadContextFunction } from '@remix-run/cloudflare-pages';
import { type PlatformProxy } from 'wrangler';
import {
  type CloudflareEnv,
  type ContextEnv,
  type ClientEnv,
  type ServerEnv,
  clientEnvSchema,
  serverEnvSchema,
} from '../constants/env';
import type { FetchApi } from '../constants/types/api';
import type { AuthSession, AuthSessionData } from '../constants/types/auth';
import { fetchApi } from '../utils/api';

declare module '@remix-run/cloudflare' {
  interface AppLoadContext extends ServerEnv, CloudflareEnv {
    readonly clientEnv: ClientEnv;
    readonly authSession: AuthSession;
    readonly fetchApi: FetchApi;
  }
}

export const getLoadContext: <Cf extends CfProperties>(
  authSession: AuthSession,
  args: {
    request: Request;
    context: {
      cloudflare: Omit<PlatformProxy<ContextEnv, Cf>, 'dispose'>;
    };
  },
) => ReturnType<GetLoadContextFunction<ContextEnv>> = async (
  authSession,
  { context },
) => {
  const clientEnv = clientEnvSchema.parse(context.cloudflare.env);
  serverEnvSchema.parse(context.cloudflare.env);

  return {
    ...context.cloudflare.env,
    clientEnv,
    authSession,
    fetchApi: async (apiInfo, variables) =>
      fetchApi(apiInfo, variables, context.cloudflare.env.API_URL, authSession),
  };
};

export const makeAuthSession = async (
  env: {
    authCookieSessionSecret: string;
    kvNamespace: KVNamespace<string>;
  },
  cookieHeader?: string | null,
) => {
  const authSessionCookie = createCookie('__auth_session', {
    secrets: [env.authCookieSessionSecret],
    sameSite: true,
  });
  const authSessionStorage = createWorkersKVSessionStorage<AuthSessionData>({
    cookie: authSessionCookie,
    kv: env.kvNamespace,
  });
  const authSession = await authSessionStorage.getSession(cookieHeader);

  return { authSessionStorage, authSession };
};
