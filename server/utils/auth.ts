import { Api, ApiError } from '../constants/api';
import type { AuthSession, AuthSessionData } from '../types/auth';

export const clearAuthToken = async (authSession: AuthSession) => {
  authSession.unset('accessToken');
  authSession.unset('accessTokenExpiresAt');
  authSession.unset('refreshToken');
  authSession.unset('refreshTokenExpiresAt');
};

export const updateAuthToken = async (
  authSession: AuthSession,
  newToken: Partial<AuthSessionData>,
) => {
  (Object.keys(newToken) as (keyof typeof newToken)[]).forEach((key) => {
    if (newToken[key]) {
      authSession.set(key, newToken[key]);
    }
  });
};

const api_getNewAccessToken = new Api<
  { refreshToken: string },
  { accessToken: string; accessTokenExpiresAt: string }
>({
  method: 'POST',
  endpoint: '/token/access',
  needToLogin: false,
  request: (variables) => ({
    body: { refreshToken: variables.refreshToken },
  }),
});

export const getAuthToken = async (
  authSession: AuthSession,
  apiUrl: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> => {
  const accessToken = authSession.get('accessToken');
  const accessTokenExpiresAtString = authSession.get('accessTokenExpiresAt');
  const refreshToken = authSession.get('refreshToken');
  const refreshTokenExpiresAtString = authSession.get('refreshTokenExpiresAt');

  if (
    accessToken === undefined ||
    refreshToken === undefined ||
    accessTokenExpiresAtString === undefined ||
    refreshTokenExpiresAtString === undefined
  ) {
    await clearAuthToken(authSession);
    return null;
  }

  const accessTokenExpiresAt = new Date(accessTokenExpiresAtString);
  const refreshTokenExpiresAt = new Date(refreshTokenExpiresAtString);

  const now = new Date();

  // access token 만료 (서버 응답 시간 등을 고려해 1분 여유 포함)
  if (accessTokenExpiresAt.getTime() + 1000 * 60 >= now.getTime()) {
    // refresh token이 만료되지 않음 (서버 응답 시간 등을 고려해 1분 여유 포함)
    if (refreshTokenExpiresAt.getTime() + 1000 * 60 < now.getTime()) {
      try {
        const fetchInfo = api_getNewAccessToken.getFetchInfo({
          refreshToken,
        });
        const response = await fetch(`${apiUrl}${fetchInfo.pathname}`, {
          method: fetchInfo.method,
          headers: fetchInfo.headers,
          body: fetchInfo.body,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await response.json<any>();

        if (response.ok) {
          await updateAuthToken(authSession, {
            accessToken: result.accessToken,
            accessTokenExpiresAt: result.accessTokenExpiresAt,
          });

          return {
            accessToken: result.accessToken,
            refreshToken,
          };
        }

        throw new ApiError({
          status: response.status,
          backendError: result,
          api: api_getNewAccessToken,
          request: fetchInfo.request,
        });
      } catch (error) {
        console.error(error);
      }
    }

    // refresh token 만료, 또는 서버 오류
    await clearAuthToken(authSession);
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
};
