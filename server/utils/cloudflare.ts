import {
  createCookie,
  createWorkersKVSessionStorage,
} from '@remix-run/cloudflare';
import { type GetLoadContextFunction } from '@remix-run/cloudflare-pages';
import { type PlatformProxy } from 'wrangler';
import { clientEnvSchema, serverEnvSchema } from '../constants/env';
import { AuthSessionService } from '../models/auth';
import type { AuthSessionData } from '../types/auth';
import type {
  ClientEnv,
  CloudflareEnv,
  ContextEnv,
  ServerEnv,
} from '../types/env';

declare module '@remix-run/cloudflare' {
  interface AppLoadContext extends ServerEnv, CloudflareEnv {
    readonly clientEnv: ClientEnv;
    readonly authSessionService: AuthSessionService;
  }
}

export const getLoadContext = <Cf extends CfProperties>(
  authSessionService: AuthSessionService,
  args: {
    request: Request;
    context: {
      cloudflare: Omit<PlatformProxy<ContextEnv, Cf>, 'dispose'>;
    };
  },
): ReturnType<GetLoadContextFunction<ContextEnv>> => {
  const clientEnv = clientEnvSchema.parse(args.context.cloudflare.env);
  serverEnvSchema.parse(args.context.cloudflare.env);

  return {
    ...args.context.cloudflare.env,
    clientEnv,
    authSessionService,
  };
};

export const makeAuthSessionService = async (
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
  return new AuthSessionService(authSessionStorage, authSession);
};
