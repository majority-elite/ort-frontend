/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiRequest {
  pathParams?: (string | number)[];
  headers?: Record<string, any>;
  params?: Record<string, any>;
  body?: any;
}

export interface ApiInfo<Variables, Result> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: `/${string}`;
  needToLogin: boolean;
  baseUrl?: string;
  errorMessage?: {
    messageByStatus?: Record<number, { message: string }>;
  };
  request: (variables: Variables) => ApiRequest;
  _resultType?: Result;
}

export type FetchApi = <Variables, Result>(
  apiInfo: ApiInfo<Variables, Result>,
  variables: Variables,
) => Promise<Result>;
