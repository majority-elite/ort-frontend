/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ApiRequest, BackendError } from '../types/api';

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
    api: Api<any, any>;
    request: ApiRequest;
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
