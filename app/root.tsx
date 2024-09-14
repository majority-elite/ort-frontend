import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { useEffect, useRef } from 'react';
import useErrorToast from './hooks/useErrorToast';
import * as styles from './root.css';
import { EnvContext } from '@/contexts/EnvContext';

import '@/styles/theme.css';

export const loader = async (args: LoaderFunctionArgs) =>
  json({
    env: args.context.clientEnv,
  });

const App = () => {
  const data = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const { error, clearError } = useErrorToast();
  const errorToastRemovalTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      if (errorToastRemovalTimeoutIdRef.current) {
        clearTimeout(errorToastRemovalTimeoutIdRef.current);
      }
      const timeoutId = setTimeout(() => {
        clearError();
      }, 5000);
      errorToastRemovalTimeoutIdRef.current = timeoutId;
    }

    // `error` 외 다른 것이 바뀔 때는 호출되지 않아야 함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <EnvContext.Provider value={data.env}>
          <Outlet />
          {fetchers.length > 0 && (
            <div className={styles.loadingToast}>
              <div className={styles.loadingLottie}>
                <DotLottieReact src="/loading-lottie.json" loop autoplay />
              </div>
              <span className={styles.loadingToastText}>서버 통신 중...</span>
            </div>
          )}
          {error && (
            <div className={styles.errorToastWrap}>
              <div className={styles.errorToast}>
                <span className={styles.errorToastText}>{error.message}</span>
              </div>
            </div>
          )}
        </EnvContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.log('ErrorBoundary', error);

  return <p>Error</p>;
};

export default App;
