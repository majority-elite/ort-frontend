import {
  createCookie,
  createWorkersKVSessionStorage,
} from '@remix-run/cloudflare';
import { type GetLoadContextFunction } from '@remix-run/cloudflare-pages';
import { type PlatformProxy } from 'wrangler';
import { clientEnvSchema, serverEnvSchema } from '../constants/env';
import type { FetchApi } from '../types/api';
import type { AuthSession, AuthSessionData } from '../types/auth';
import type {
  ClientEnv,
  CloudflareEnv,
  ContextEnv,
  ServerEnv,
} from '../types/env';
import { fetchApiImpl } from '../utils/api';

declare module '@remix-run/cloudflare' {
  interface AppLoadContext extends ServerEnv, CloudflareEnv {
    readonly clientEnv: ClientEnv;
    readonly authSession: AuthSession;
    /**
     * `ApiInfo` 객체로 백엔드 API를 호출하는 함수
     * @example
     * ```
     * import { type ActionFunctionArgs } from '@remix-run/cloudflare';
     * import { api_getPost } from '@/apis/post';
     *
     * export const action = async ({ context }: ActionFunctionArgs) => {
     *   const apiReturn = await context.fetchApi(api_getPost, { id: 4 });
     *   if (!apiReturn.isSuccess) {
     *     return apiReturn.errorResponse;
     *   }
     *   const { response } = apiReturn;
     *   // ...
     * };
     * ```
     * - `loader`와 같이 오류 발생 시 `ErrorBoundary`로 이동해야 하는 경우 `throwOnError` 옵션 사용
     * ```
     * import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
     * import { api_getPost } from '@/apis/post';
     *
     * export const loader = async ({ context }: LoaderFunctionArgs) => {
     *   const { response } = await context.fetchApi(
     *     api_getPost,
     *     { id: 4 },
     *     { throwOnError: true },
     *   );
     *   // ...
     * };
     * ```
     */
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
    fetchApi: (async (api, variables, options) =>
      fetchApiImpl(
        api,
        variables,
        context.cloudflare.env.API_URL,
        authSession,
        options,
      )) as FetchApi,
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
