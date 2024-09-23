import type { ApiError } from '@/models/api';

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonObject = {
  [K in string]: JsonValue;
} & {
  [K in string]?: JsonValue;
};
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequest {
  pathParams?: (string | number)[];
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

/**
 * 백엔드 서버에서 응답하는 에러 형식
 */
export type BackendError = {
  timestamp: string;
  status: number;
  error: string;
  path: string;
};

interface FrontendResponseBase<T extends JsonValue> {
  status: number;
  result: T;
}

/**
 * `action`에서 요청 성공 시 응답하는 형식
 */
export interface FrontendSuccessResponse<T extends JsonValue>
  extends FrontendResponseBase<T> {
  isSuccess: true;
}

/**
 * `action`에서 요청 실패 시 응답하는 형식
 */
export interface FrontendErrorResponse<T extends JsonValue>
  extends FrontendResponseBase<T> {
  isSuccess: false;
  message: string;
}

/**
 * `Api.fetch`에서 요청 성공 시 응답하는 형식
 */
export type ApiSuccessReturn<Result> = {
  isSuccess: true;
  result: Result;
};
/**
 * `Api.fetch`에서 요청 실패 시 응답하는 형식
 */
export type ApiFailureReturn = {
  isSuccess: false;
  error: ApiError;
};

/**
 * `Api.fetch`에서 응답하는 형식
 */
export type ApiReturn<Result> = ApiSuccessReturn<Result> | ApiFailureReturn;

/**
 * `Api.fetch`에 줄 수 있는 옵션 목록
 */
export interface ApiOptions {
  throwOnError?: boolean;
}

export type ApiFetchInfo = {
  pathname: string;
  method: ApiMethod;
  headers: Record<string, string>;
  body?: string | FormData;
  request: ApiRequest;
};
