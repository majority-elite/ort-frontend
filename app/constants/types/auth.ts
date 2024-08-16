import type { SessionStorage } from '@remix-run/cloudflare';

export interface AuthSessionData {
  accessToken: string;
  refreshToken: string;
}

export type AuthSessionStorage = SessionStorage<AuthSessionData>;
