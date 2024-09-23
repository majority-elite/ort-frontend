// eslint-disable-next-line no-restricted-imports
import { redirect as remixRedirect } from '@remix-run/cloudflare';
import { type AuthSessionService } from '@server';

/**
 * `@remix-run/cloudflare`의 `redirect` 재구현체
 * - 필요한 경우 `Set-Cookie` header를 주입해줌
 * >- redirect 응답 시 `entry.server.tsx`의 `handleRequest`, `handleDataRequest`를 통하지 않기 때문 ([관련 이슈](https://github.com/remix-run/remix/issues/2997))
 */
export const redirectWithAuthCookie = async (
  url: string,
  authSessionService: AuthSessionService,
  init?: ResponseInit,
) => {
  const authCookieHeader = await authSessionService.commitSession();
  if (authCookieHeader) {
    return remixRedirect(url, {
      status: 302,
      ...init,
      headers: {
        'Set-Cookie': authCookieHeader,
        ...init?.headers,
      },
    });
  }
  return remixRedirect(url, init);
};
