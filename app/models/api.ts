import { type AppLoadContext } from '@remix-run/cloudflare';
import type {
  ApiFetchInfo,
  ApiMethod,
  ApiOptions,
  ApiRequest,
  ApiReturn,
  ApiSuccessReturn,
  BackendError,
} from '@/types/api';

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
  public method: ApiMethod;
  public endpoint: `/${string}`;
  public needToLogin: boolean;
  public baseUrl?: string;
  public errorMessage?: {
    messageByStatus?: Record<number, { message: string }>;
  };
  public request: (variables: Variables) => ApiRequest;

  constructor(apiInfo: {
    method: ApiMethod;
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

  getFetchInfo(variables: Variables, accessToken?: string): ApiFetchInfo {
    const parsedRequest = this.request(variables);

    const pathString =
      parsedRequest.pathParams && parsedRequest.pathParams.length > 0
        ? '/' + parsedRequest.pathParams.join('/')
        : '';

    const params = parsedRequest.queryParams ?? {};
    const queryString = Object.keys(params)
      .map((item) => `${item}=${params[item]}`)
      .join('&');

    const pathname = `${this.endpoint}${pathString}${
      queryString.length > 0 ? `?${queryString}` : ''
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
   * export const action = async ({ context }: ActionFunctionArgs) => {
   *   // ...
   *   const apiReturn = await api_loginWithKakao.fetch({ code, state }, context);
   *   if (!apiReturn.isSuccess) {
   *     return makeErrorResponse(apiReturn.error);
   *   }
   *   const { result } = apiReturn;
   *   // ...
   * };
   *
   * // Case 2: `loader`는 Error Response를 반환하기보다 에러 자체를 throw해야 하는 경우가 대부분임
   * // 이 경우 `throwOnError` 옵션을 주면 `isSuccess`를 체크하지 않아도 자동으로 `ApiSuccessReturn`으로 추론
   * export const loader = async ({ context }: LoaderFunctionArgs) => {
   *   // ...
   *   const { result } = await api_loginWithKakao.fetch(
   *     { code, state },
   *     context,
   *     { throwOnError: true },
   *   );
   *   // ...
   * };
   * ```
   */
  async fetch(
    variables: Variables,
    context: AppLoadContext,
    options?: ApiOptions & { throwOnError?: false },
  ): Promise<ApiReturn<Result>>;
  async fetch(
    variables: Variables,
    context: AppLoadContext,
    options?: ApiOptions & { throwOnError: true },
  ): Promise<ApiSuccessReturn<Result>>;
  async fetch(
    variables: Variables,
    context: AppLoadContext,
    options?: ApiOptions,
  ): Promise<ApiReturn<Result>> {
    const baseUrl: string = this.baseUrl ?? import.meta.env.SERVER_API_URL;

    const token = context.authSession
      ? await context.authSessionService.getAuthToken()
      : null;

    const fetchInfo = this.getFetchInfo(variables, token?.accessToken);

    const fetchUrl = `${baseUrl}${fetchInfo.pathname}`;

    try {
      if (!token?.accessToken && this.needToLogin) {
        throw new ApiError({
          status: 401,
          api: this,
          request: fetchInfo.request,
          fetchInfo,
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
        fetchInfo,
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

      console.error(error, this, variables);
      const apiError = new ApiError({
        api: this,
        request: fetchInfo.request,
        fetchInfo,
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

  public fetchInfo: ApiFetchInfo;

  public frontendError?: unknown;

  constructor(error: {
    status?: number;
    message?: string;
    backendError?: BackendError;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api: Api<any, any>;
    request: ApiRequest;
    fetchInfo: ApiFetchInfo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontendError?: any;
  }) {
    super(error.message ?? '문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    this.name = 'ApiError';
    this.status = error.status ?? error.backendError?.status;
    this.api = error.api;
    this.request = error.request;
    this.fetchInfo = error.fetchInfo;
    this.serverError = error.backendError;
    this.frontendError = error.frontendError;
  }
}
