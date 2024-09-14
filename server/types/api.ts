/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Api, ApiError } from '../constants/api';

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonObject = {
  [K in string]: JsonValue;
} & {
  [K in string]?: JsonValue;
};
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface ApiRequest {
  pathParams?: (string | number)[];
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number>;
  body?: any;
}

export interface BackendError {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}

export interface FrontendResponseBase<T extends JsonValue> {
  status: number;
  result: T;
}

export interface FrontendSuccessResponse<T extends JsonValue>
  extends FrontendResponseBase<T> {
  isSuccess: true;
}

export interface FrontendErrorResponse<T extends JsonValue>
  extends FrontendResponseBase<T> {
  isSuccess: false;
  message: string;
}

export type ApiSuccessReturnType<Result> = {
  isSuccess: true;
  response: Result;
};
export type ApiFailureReturnType = {
  isSuccess: false;
  error: ApiError;
};

export type ApiReturnType<Result> =
  | ApiSuccessReturnType<Result>
  | ApiFailureReturnType;

export interface ApiOptions {
  throwOnError?: boolean;
}

export type FetchApi = {
  <Variables, Result>(
    api: Api<Variables, Result>,
    variables: Variables,
    options?: ApiOptions & {
      throwOnError?: false;
    },
  ): Promise<ApiReturnType<Result>>;
  <Variables, Result>(
    api: Api<Variables, Result>,
    variables: Variables,
    options?: ApiOptions & {
      throwOnError: true;
    },
  ): Promise<ApiSuccessReturnType<Result>>;
};
