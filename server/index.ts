export { Api, ApiError } from './constants/api';
export { serverEnvSchema, clientEnvSchema } from './constants/env';

export type {
  JsonValue,
  ApiRequest,
  FetchApi,
  BackendError,
  FrontendSuccessResponse,
  FrontendErrorResponse,
} from './types/api';
export type {
  AuthSession,
  AuthSessionData,
  AuthSessionStorage,
} from './types/auth';
export type {
  ServerEnv,
  ClientEnv,
  CloudflareEnv,
  ContextEnv,
} from './types/env';

export { makeSuccessResponse, makeErrorResponse } from './utils/api';
export { getLoadContext, makeAuthSession } from './utils/cloudflare';

export { remixCloudflareDevProxyVitePlugin } from './vite';
