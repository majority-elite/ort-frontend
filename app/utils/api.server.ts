import { getAuthToken } from './auth.server';
import { ApiError } from '@/constants/api';
import type { ApiInfo } from '@/constants/types/api';
import type { AuthSession } from '@/constants/types/auth';

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

export const api =
  <Result>() =>
  <Variables>(
    apiInfo: Omit<ApiInfo<Variables, Result>, '_resultType'>,
  ): ApiInfo<Variables, Result> =>
    apiInfo;

export const fetchApi = async <Variables, Result>(
  apiInfo: ApiInfo<Variables, Result>,
  variables: Variables,
  apiUrl: string,
  authSession?: AuthSession,
): Promise<Result> => {
  const baseUrl = apiInfo.baseUrl ?? apiUrl;
  const url = `${baseUrl}${apiInfo.endpoint}`;
  const parsedRequest = apiInfo.request(variables);

  const pathString =
    parsedRequest.pathParams?.reduce<string>(
      (prev, cur) => `${prev}/${cur}`,
      '',
    ) ?? '';

  const params = parsedRequest.params ?? {};
  const queryString = Object.keys(params).reduce(
    (prev, cur) =>
      `${prev}${
        params[cur] !== null && params[cur] !== undefined
          ? `&${cur}=${params[cur]}`
          : ''
      }`,
    '',
  );

  const fetchUrl = `${url}${pathString}${
    queryString ? `?${queryString.slice(1)}` : ''
  }`;

  try {
    const token = authSession ? await getAuthToken(authSession, apiUrl) : null;

    if (!token?.accessToken && apiInfo.needToLogin) {
      throw new ApiError({
        status: 401,
        path: fetchUrl,
        request: parsedRequest,
        ...COMMON_ERROR.errorByStatus[401],
      });
    }

    const authorizationHeader = token?.accessToken
      ? {
          Authorization: `Bearer ${token.accessToken}`,
        }
      : undefined;

    const response = await fetch(fetchUrl, {
      method: apiInfo.method,
      body:
        // eslint-disable-next-line no-nested-ternary
        parsedRequest.body !== undefined
          ? parsedRequest.body instanceof FormData
            ? parsedRequest.body
            : JSON.stringify(parsedRequest.body)
          : undefined,
      headers: {
        'Content-Type':
          parsedRequest.body instanceof FormData
            ? 'multipart/form-data'
            : 'application/json',
        ...authorizationHeader,
        ...parsedRequest.headers,
      },
    });

    // `Result`가 `null`인 경우가 있지만 이는 try-catch에 의한 것으로, 타입 체계상에서는 분기처리할 수 없음
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    try {
      result = await response.json<Result>();
    } catch (error) {
      console.log(error, `${apiInfo.method} ${apiInfo.endpoint}`);
      result = null;
    }

    if (response.ok) {
      return result;
    }

    // TODO: 서버 쪽 schema 전달되면 타입 수정
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serverError: any = result;

    const error: {
      message?: string;
    } = {};

    // common error message (by status) - 3rd priority
    error.message =
      COMMON_ERROR.errorByStatus[response.status]?.message ?? error.message;

    // error message by status - 2nd priority
    error.message =
      apiInfo.errorMessage?.messageByStatus?.[response.status]?.message ??
      error.message;

    // error message from server - 1st priority
    if (serverError.message) {
      error.message = serverError.message ?? error.message;
    }

    throw new ApiError({
      ...error,
      status: response.status,
      path: apiInfo.endpoint,
      serverError: result,
      request: parsedRequest,
    });
  } catch (error) {
    // 이미 처리된 에러는 그대로 반환
    if (error instanceof ApiError) {
      console.log(error.serverError);
      throw error;
    }

    // TODO: Sentry 등 에러 로깅 솔루션 추가
    console.error(error, apiInfo.request(variables), fetchUrl);
    throw new ApiError({
      path: apiInfo.endpoint,
      request: parsedRequest,
      clientError: error,
    });
  }
};
