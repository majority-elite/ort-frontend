import { json, type TypedResponse } from '@remix-run/cloudflare';
import { ApiError } from '@/models/api';
import type {
  BackendError,
  FrontendErrorResponse,
  FrontendSuccessResponse,
  JsonValue,
} from '@/types/api';
import type { Optional } from '@/types/util';

/**
 * `action` 성공 시 반환할 response 생성
 * @example
 * ```
 * // `status`를 넘기지 않으면 status는 200이 됨
 * const successResponse = makeSuccessResponse({
 *   result: {
 *     id: 4,
 *     nickname: 'test',
 *   },
 * });
 * ```
 */
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

/**
 * `action`에서 에러 발생 시 반환할 response 생성
 * @example
 * ```
 * // Case 1: `ApiError`를 이용하는 경우
 * const response = await api_loginWithKakao.fetch(...);
 * if (!response.isSuccess) {
 *   return makeErrorResponse(response.error);
 * }
 *
 * // Case 2: `result`를 포함한 정보들을 직접 명시하는 경우
 * const errorResponse = makeErrorResponse({
 *   result: {
 *     expected: 4,
 *     received: 5,
 *   },
 *   status: 400,
 * });
 *
 * // Case 3: `result`를 명시하지 않고, 나머지 정보는 명시하는 경우
 * // 이 경우 `result`는 자동으로 `null`이 됨
 * const errorResponse = makeErrorResponse({
 *   status: 404,
 *   message: '없는 정보입니다.',
 * });
 * ```
 */
export function makeErrorResponse(
  info: ApiError,
  init?: ResponseInit,
): TypedResponse<FrontendErrorResponse<BackendError | null>>;
export function makeErrorResponse<T extends JsonValue>(
  info: Omit<
    Optional<FrontendErrorResponse<T>, 'status' | 'message'>,
    'isSuccess'
  >,
  init?: ResponseInit,
): TypedResponse<FrontendErrorResponse<T>>;
export function makeErrorResponse(
  info: Omit<
    Optional<FrontendErrorResponse<null>, 'status' | 'message'>,
    'isSuccess' | 'result'
  >,
  init?: ResponseInit,
): TypedResponse<FrontendErrorResponse<null>>;
export function makeErrorResponse<T extends JsonValue>(
  info:
    | Omit<
        Optional<FrontendErrorResponse<T>, 'status' | 'message' | 'result'>,
        'isSuccess'
      >
    | ApiError,
  init?: ResponseInit,
): TypedResponse<FrontendErrorResponse<T | BackendError | null>> {
  return info instanceof ApiError
    ? json<FrontendErrorResponse<BackendError | null>>(
        {
          isSuccess: false,
          status: info.status ?? 500,
          message: info.message,
          result: info.serverError ?? null,
        },
        { status: info.status ?? 500, ...init },
      )
    : json<FrontendErrorResponse<T | null>>(
        {
          ...info,
          isSuccess: false,
          status: info.status ?? 500,
          message:
            info.message ?? '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          result: info.result ?? null,
        },
        { status: info.status ?? 500, ...init },
      );
}
