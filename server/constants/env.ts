import { z } from 'zod';

// 클라이언트용은 CLIENT_, 서버용은 SERVER_, 양쪽 모두 사용하는 용도는 SHARED_
const envSchemaObject = {
  SERVER_AUTH_COOKIE_SESSION_SECRET: z.string(),
  SERVER_API_URL: z.string().regex(/^(.*[^/])$/g, {
    message: 'API 주소는 슬래시(/)로 끝나지 않아야 합니다.',
  }),
  SHARED_SENTRY_DSN: z.string(),
  SHARED_APP_MODE: z.enum(['development', 'preview', 'production']),
} satisfies Record<
  `${'SERVER_' | 'CLIENT_' | 'SHARED_'}${string}`,
  z.ZodString | z.ZodEnum<[string, ...string[]]>
>;

export const envSchema = z.object(envSchemaObject);
