import { json, TypedResponse } from '@remix-run/cloudflare';
import { Api, ApiError } from '../constants/api';
import type {
  ApiOptions,
  ApiReturnType,
  BackendError,
  FrontendErrorResponse,
  FrontendSuccessResponse,
  JsonValue,
} from '../types/api';
import type { AuthSession } from '../types/auth';
import { getAuthToken } from './auth';

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

const COMMON_ERROR: {
  errorByStatus: Record<
    number,
    {
      message: string;
    }
  >;
} = {
  errorByStatus: {
    401: {
      message: '로그인이 필요합니다',
    },
  },
};

export const fetchApiImpl = async <Variables, Result>(
  api: Api<Variables, Result>,
  variables: Variables,
  apiUrl: string,
  authSession?: AuthSession,
  options?: ApiOptions,
): Promise<ApiReturnType<Result>> => {
  try {
    const baseUrl = api.baseUrl ?? apiUrl;

    const token = authSession ? await getAuthToken(authSession, apiUrl) : null;

    const fetchInfo = api.getFetchInfo(variables, token?.accessToken);

    const fetchUrl = `${baseUrl}${fetchInfo.pathname}`;

    if (!token?.accessToken && api.needToLogin) {
      throw new ApiError({
        status: 401,
        api,
        request: fetchInfo.request,
        ...COMMON_ERROR.errorByStatus[401],
      });
    }

    const response = await fetch(fetchUrl, {
      method: fetchInfo.method,
      body: fetchInfo.body,
      headers: fetchInfo.headers,
    });

    // `Result`가 `null`인 경우가 있지만 이는 try-catch에 의한 것으로, 타입 체계상에서는 분기처리할 수 없음
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    try {
      result = await response.json<Result>();
    } catch (error) {
      console.log(error, `${api.method} ${api.endpoint}`);
      result = null;
    }

    if (response.ok) {
      return {
        isSuccess: true,
        response: result,
      };
    }

    const backendError: BackendError | null = result;

    const error: {
      message?: string;
    } = {};

    // common error message (by status) - 3rd priority
    error.message =
      COMMON_ERROR.errorByStatus[response.status]?.message ?? error.message;

    // error message by status - 2nd priority
    error.message =
      api.errorMessage?.messageByStatus?.[response.status]?.message ??
      error.message;

    // error message from server - 1st priority
    error.message = backendError?.error ?? error.message;

    throw new ApiError({
      ...error,
      status: response.status,
      api,
      backendError: backendError ?? undefined,
      request: fetchInfo.request,
    });
  } catch (error) {
    // 이미 처리된 에러는 그대로 반환
    if (error instanceof ApiError) {
      console.log(error.serverError);
      if (options?.throwOnError) {
        throw error;
      }
      return {
        isSuccess: false,
        error: error,
      };
    }

    // TODO: Sentry 등 에러 로깅 솔루션 추가
    console.error(error, api, variables);
    const apiError = new ApiError({
      api,
      request: api.request(variables),
      frontendError: error,
    });
    if (options?.throwOnError) {
      throw apiError;
    }
    return {
      isSuccess: false,
      error: apiError,
    };
  }
};
