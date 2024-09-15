import { type AppLoadContext } from '@remix-run/cloudflare';
import type {
  AuthSession,
  AuthSessionData,
  AuthSessionStorage,
} from '../types/auth';

export class AuthSessionService {
  private authSessionStorage: AuthSessionStorage;
  private authSession: AuthSession;

  constructor(
    authSessionStorage: AuthSessionStorage,
    authSession: AuthSession,
  ) {
    this.authSessionStorage = authSessionStorage;
    this.authSession = authSession;
  }

  async commitSession(): Promise<string> {
    return await this.authSessionStorage.commitSession(this.authSession);
  }

  async clearAuthToken() {
    this.authSession.unset('accessToken');
    this.authSession.unset('accessTokenExpiresAt');
    this.authSession.unset('refreshToken');
    this.authSession.unset('refreshTokenExpiresAt');
  }

  /**
   * auth token 값을 업데이트하는 method
   * - `newToken`에 명시하지 않은 key는 수정되지 않음
   * @example
   * ```
   * // `accessToken`, `accessTokenExpiresAt`은 수정되고, `refreshToken` 등 다른 요소는 변화 없음
   * await authSessionService.updateAuthToken({
   *   accessToken,
   *   accessTokenExpiresAt,
   * });
   * ```
   */
  async updateAuthToken(newToken: Partial<AuthSessionData>) {
    (Object.keys(newToken) as (keyof typeof newToken)[]).forEach((key) => {
      if (newToken[key]) {
        this.authSession.set(key, newToken[key]);
      }
    });
  }

  /**
   * access token을 얻는 method
   * - access token이 만료된 경우 refresh token으로 자동 업데이트
   */
  async getAuthToken(context: AppLoadContext): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    const accessToken = this.authSession.get('accessToken');
    const accessTokenExpiresAtString = this.authSession.get(
      'accessTokenExpiresAt',
    );
    const refreshToken = this.authSession.get('refreshToken');
    const refreshTokenExpiresAtString = this.authSession.get(
      'refreshTokenExpiresAt',
    );

    if (
      accessToken === undefined ||
      refreshToken === undefined ||
      accessTokenExpiresAtString === undefined ||
      refreshTokenExpiresAtString === undefined
    ) {
      await this.clearAuthToken();
      return null;
    }

    const accessTokenExpiresAt = new Date(accessTokenExpiresAtString);
    const refreshTokenExpiresAt = new Date(refreshTokenExpiresAtString);

    const now = new Date();

    // access token 만료 (서버 응답 시간 등을 고려해 1분 여유 포함)
    if (accessTokenExpiresAt.getTime() + 1000 * 60 <= now.getTime()) {
      // refresh token이 만료되지 않음 (서버 응답 시간 등을 고려해 1분 여유 포함)
      if (refreshTokenExpiresAt.getTime() > now.getTime() + 1000 * 60) {
        try {
          const response = await fetch(`${context.API_URL}/token/access`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          const result = await response.json<{
            accessToken: string;
            accessTokenExpiresAt: string;
          }>();

          if (response.ok) {
            await this.updateAuthToken({
              accessToken: result.accessToken,
              accessTokenExpiresAt: result.accessTokenExpiresAt,
            });

            return {
              accessToken: result.accessToken,
              refreshToken,
            };
          }

          console.error(response.status, result);
        } catch (error) {
          console.error(error);
        }
      }

      // refresh token 만료, 또는 서버 오류
      await this.clearAuthToken();
      return null;
    }

    return {
      accessToken,
      refreshToken,
    };
  }
}
