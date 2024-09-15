import { json, type TypedResponse } from '@remix-run/cloudflare';
import type {
  FrontendErrorResponse,
  FrontendSuccessResponse,
  JsonValue,
} from '@/types/api';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const makeSuccessResponse = <T extends JsonValue>(
  info: Omit<Optional<FrontendSuccessResponse<T>, 'status'>, 'isSuccess'>,
  init?: ResponseInit,
) =>
  json<FrontendSuccessResponse<T>>(
    {
      ...info,
      isSuccess: true,
      status: info.status ?? 200,
    },
    { status: info.status ?? 200, ...init },
  );

export const makeErrorResponse = <T extends JsonValue>(
  info: Omit<
    Optional<FrontendErrorResponse<T>, 'status' | 'message'>,
    'isSuccess'
  >,
  init?: ResponseInit,
): TypedResponse<FrontendErrorResponse<T>> =>
  json<FrontendErrorResponse<T>>(
    {
      ...info,
      isSuccess: false,
      status: info.status ?? 500,
      message:
        info.message ?? '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    },
    { status: info.status ?? 500, ...init },
  );
