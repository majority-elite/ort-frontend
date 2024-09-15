import { type AppLoadContext } from '@remix-run/cloudflare';
import type {
  ApiOptions,
  ApiRequest,
  ApiReturnType,
  ApiSuccessReturnType,
  BackendError,
} from '@/types/api';
import { getAuthToken } from '@server';

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

export class Api<Variables, Result> {
  public method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  public endpoint: `/${string}`;
  public needToLogin: boolean;
  public baseUrl?: string;
  public errorMessage?: {
    messageByStatus?: Record<number, { message: string }>;
  };
  public request: (variables: Variables) => ApiRequest;

  constructor(apiInfo: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: `/${string}`;
    needToLogin?: boolean;
    baseUrl?: string;
    errorMessage?: {
      messageByStatus?: Record<number, { message: string }>;
    };
    request: (variables: Variables) => ApiRequest;
  }) {
    this.method = apiInfo.method;
    this.endpoint = apiInfo.endpoint;
    this.needToLogin = apiInfo.needToLogin ?? false;
    this.baseUrl = apiInfo.baseUrl;
    this.errorMessage = apiInfo.errorMessage;
    this.request = apiInfo.request;
  }

  getFetchInfo(
    variables: Variables,
    accessToken?: string,
  ): {
    pathname: string;
    method: Api<Variables, Result>['method'];
    headers: ApiRequest['headers'];
    body?: string | FormData;
    request: ApiRequest;
  } {
    const parsedRequest = this.request(variables);

    const pathString =
      parsedRequest.pathParams?.reduce<string>(
        (prev, cur) => `${prev}/${cur}`,
        '',
      ) ?? '';

    const params = parsedRequest.queryParams ?? {};
    const queryString = Object.keys(params).reduce(
      (prev, cur) =>
        `${prev}${
          params[cur] !== null && params[cur] !== undefined
            ? `&${cur}=${params[cur]}`
            : ''
        }`,
      '',
    );

    const pathname = `${this.endpoint}${pathString}${
      queryString ? `?${queryString.slice(1)}` : ''
    }`;

    const authorizationHeader = accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined;

    return {
      pathname,
      method: this.method,
      headers: {
        'Content-Type':
          parsedRequest.body instanceof FormData
            ? 'multipart/form-data'
            : 'application/json',
        ...authorizationHeader,
        ...parsedRequest.headers,
      },
      body:
        // eslint-disable-next-line no-nested-ternary
        parsedRequest.body !== undefined
          ? parsedRequest.body instanceof FormData
            ? parsedRequest.body
            : JSON.stringify(parsedRequest.body)
          : undefined,
      request: parsedRequest,
    };
  }

  /**
   * 백엔드 API를 호출하는 method
   * @example
   * ```
   * // Case 1: `action`에서의 일반적인 활용
   * export const action = ({ context }: ActionFunctionArgs) => {
   *   // ...
   *   const response = api_loginWithKakao.fetch({ code, state }, context);
   *   if (!response.isSuccess) {
   *     return makeErrorResponse(response.error);
   *   }
   *   const { result } = response;
   *   // ...
   * };
   *
   * // Case 2: `loader`는 Error Response를 반환하기보다 에러 자체를 throw해야 하는 경우가 대부분임
   * // 이 경우 `throwOnError` 옵션을 주면 `isSuccess`를 체크하지 않아도 자동으로 `ApiSuccessReturnType`으로 추론
   * export const loader = ({ context }: LoaderFunctionArgs) => {
   *   // ...
   *   const { result } = api_loginWithKakao.fetch({ code, state }, context);
   *   // ...
   * };
   * ```
   */
  async fetch(
    variables: Variables,
    context: AppLoadContext,
    options?: ApiOptions & { throwOnError?: false },
  ): Promise<ApiReturnType<Result>>;
  async fetch(
    variables: Variables,
    context: AppLoadContext,
    options?: ApiOptions & { throwOnError: true },
  ): Promise<ApiSuccessReturnType<Result>>;
  async fetch(
    variables: Variables,
    context: AppLoadContext,
    options?: ApiOptions,
  ): Promise<ApiReturnType<Result>> {
    try {
      const baseUrl = this.baseUrl ?? context.API_URL;

      const token = context.authSession
        ? await getAuthToken(context.authSession, context.API_URL)
        : null;

      const fetchInfo = this.getFetchInfo(variables, token?.accessToken);

      const fetchUrl = `${baseUrl}${fetchInfo.pathname}`;

      if (!token?.accessToken && this.needToLogin) {
        throw new ApiError({
          status: 401,
          api: this,
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
        console.log(error, `${this.method} ${this.endpoint}`);
        result = null;
      }

      if (response.ok) {
        return {
          isSuccess: true,
          result,
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
        this.errorMessage?.messageByStatus?.[response.status]?.message ??
        error.message;

      // error message from server - 1st priority
      error.message = backendError?.error ?? error.message;

      throw new ApiError({
        ...error,
        status: response.status,
        api: this,
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
      console.error(error, this, variables);
      const apiError = new ApiError({
        api: this,
        request: this.request(variables),
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
  }
}

export class ApiError extends Error {
  public status?: number;

  public serverError?: BackendError;

  public api: Api<unknown, unknown>;

  public request: ApiRequest;

  public frontendError?: unknown;

  constructor(error: {
    status?: number;
    message?: string;
    backendError?: BackendError;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api: Api<any, any>;
    request: ApiRequest;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontendError?: any;
  }) {
    super(error.message ?? '문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    this.name = 'ApiError';
    this.status = error.status ?? error.backendError?.status;
    this.api = error.api;
    this.request = error.request;
    this.serverError = error.backendError;
    this.frontendError = error.frontendError;
  }
}
