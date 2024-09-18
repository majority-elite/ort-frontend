import type { z } from 'zod';
import type { envSchema } from '../constants/env';

export type Env = z.infer<typeof envSchema>;

export type CloudflareEnv = {
  readonly KV_NAMESPACE: KVNamespace<string>;
};

export type ContextEnv = CloudflareEnv;
