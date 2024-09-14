import { type TypedResponse } from '@remix-run/cloudflare';
// `useTypedFetcher`를 사용하라는 규칙인데 이 파일이 바로 그 구현체이므로 무시
// eslint-disable-next-line no-restricted-imports
import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import useErrorToast from './useErrorToast';
import {
  type FrontendErrorResponse,
  type FrontendSuccessResponse,
  type JsonValue,
} from '@server';

const useTypedFetcher = <
  T extends (
    ...params: unknown[]
  ) => Promise<
    | TypedResponse<FrontendSuccessResponse<JsonValue>>
    | TypedResponse<FrontendErrorResponse<JsonValue>>
  >,
>(
  ...params: Parameters<typeof useFetcher<T>>
) => {
  const fetcher = useFetcher<T>(...params);
  const { setError } = useErrorToast();

  useEffect(() => {
    if (fetcher.data !== undefined && !fetcher.data.isSuccess) {
      setError(fetcher.data);
    }
    // `fetcher.data` 외 다른 것이 변할 때는 실행되면 안 됨
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return fetcher;
};

export default useTypedFetcher;
