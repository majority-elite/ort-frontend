import {
  createCookie,
  createWorkersKVSessionStorage,
} from '@remix-run/cloudflare';
import { type GetLoadContextFunction } from '@remix-run/cloudflare-pages';
import { type PlatformProxy } from 'wrangler';
import { AuthSessionService } from '../models/auth';
import type { AuthSessionData } from '../types/auth';
import type { CloudflareEnv, ContextEnv } from '../types/env';

declare module '@remix-run/cloudflare' {
  interface AppLoadContext extends CloudflareEnv {
    readonly authSessionService: AuthSessionService;
  }
}

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
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: true,
  });
  const authSessionStorage = createWorkersKVSessionStorage<AuthSessionData>({
    cookie: authSessionCookie,
    kv: env.kvNamespace,
  });
  const authSession = await authSessionStorage.getSession(cookieHeader);
  return new AuthSessionService(
    authSessionCookie,
    authSessionStorage,
    authSession,
  );
};

export const getLoadContext = async <Cf extends CfProperties>(
  args: {
    request: Request;
    context: {
      cloudflare: Omit<PlatformProxy<ContextEnv, Cf>, 'dispose'>;
    };
  },
  env: {
    authCookieSessionSecret: string;
  },
): Promise<Awaited<ReturnType<GetLoadContextFunction<ContextEnv>>>> => {
  const authSessionService = await makeAuthSessionService(
    {
      authCookieSessionSecret:
        env?.authCookieSessionSecret ??
        import.meta.env.SERVER_AUTH_COOKIE_SESSION_SECRET,
      kvNamespace: args.context.cloudflare.env.KV_NAMESPACE,
    },
    args.request.headers.get('cookie'),
  );

  return {
    ...args.context.cloudflare.env,
    authSessionService,
  };
};
