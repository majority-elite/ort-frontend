import type { SessionStorage, Session } from '@remix-run/cloudflare';

export interface AuthSessionData {
  accessToken: string;
  /** ISO String (ex: 2024-08-16T15:59:55.762599902Z) */
  accessTokenExpiresAt: string;
  refreshToken: string;
  /** ISO String (ex: 2024-08-16T15:59:55.762599902Z) */
  refreshTokenExpiresAt: string;
}

export type AuthSessionStorage = SessionStorage<AuthSessionData>;
export type AuthSession = Session<AuthSessionData>;
