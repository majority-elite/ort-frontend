import type { z } from 'zod';
import type { clientEnvSchema, serverEnvSchema } from '../constants/env';

export type ClientEnv = Readonly<z.infer<typeof clientEnvSchema>>;

export type ServerEnv = Readonly<z.infer<typeof serverEnvSchema>>;

export type CloudflareEnv = {
  readonly KV_NAMESPACE: KVNamespace<string>;
};

export type ContextEnv = ClientEnv & ServerEnv & CloudflareEnv;
