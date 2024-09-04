import { z } from 'zod';

export const clientEnvSchema = z.object({
  KAKAO_CLIENT_ID: z.string(),
});

export const serverEnvSchema = z.object({
  AUTH_COOKIE_SESSION_SECRET: z.string(),
  API_URL: z.string(),
});

export type ClientEnv = Readonly<z.infer<typeof clientEnvSchema>>;

export type ServerEnv = Readonly<z.infer<typeof serverEnvSchema>>;

export type CloudflareEnv = {
  readonly KV_NAMESPACE: KVNamespace<string>;
};

export type ContextEnv = ClientEnv & ServerEnv & CloudflareEnv;
