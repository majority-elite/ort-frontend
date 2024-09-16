import { z } from 'zod';

export const clientEnvSchema = z.object({
  API_URL: z.string().regex(/^(.*[^/])$/g, {
    message: 'API 주소는 슬래시(/)로 끝나지 않아야 합니다.',
  }),
});

export const serverEnvSchema = z.object({
  AUTH_COOKIE_SESSION_SECRET: z.string(),
  API_URL: z.string().regex(/^(.*[^/])$/g, {
    message: 'API 주소는 슬래시(/)로 끝나지 않아야 합니다.',
  }),
});
