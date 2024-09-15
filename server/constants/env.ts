import { z } from 'zod';

export const clientEnvSchema = z.object({
  KAKAO_CLIENT_ID: z.string(),
});

export const serverEnvSchema = z.object({
  AUTH_COOKIE_SESSION_SECRET: z.string(),
  API_URL: z.string(),
});
