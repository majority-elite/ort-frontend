/* eslint-disable @typescript-eslint/no-explicit-any */

interface ClientError {
  status?: number;
  message?: string;
  path: string;
  /** TODO: 서버 쪽 schema 전달되면 타입 수정 */
  serverError?: any;
  request?: any;
  clientError?: any;
}

export class ApiError extends Error {
  public status?: number;

  public path: string;

  /** TODO: 서버 쪽 schema 전달되면 타입 수정 */
  public serverError?: any;

  public request?: any;

  public clientError?: any;

  constructor(error: ClientError) {
    super(error.message ?? '문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    this.name = 'ApiError';
    this.status = error.status ?? error.serverError?.status;
    this.path = error.path;
    this.serverError = error.serverError;
    this.request = error.request;
    this.clientError = error.clientError;
  }
}
