import type {
  AppLoadContext,
  EntryContext,
  HandleDataRequestFunction,
} from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import * as isbotModule from 'isbot';
import { renderToReadableStream } from 'react-dom/server';

Sentry.init({
  dsn: import.meta.env.SHARED_SENTRY_DSN,
  tracesSampleRate: 1,
  autoInstrumentRemix: true,
  environment: import.meta.env.SHARED_APP_MODE,
  debug: import.meta.env.SHARED_APP_MODE === 'development',
  integrations: [Sentry.extraErrorDataIntegration()],
});

export const handleError = Sentry.sentryHandleError;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isBotRequest(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  const cookieHeader = await loadContext.authSessionService.commitSession();
  if (cookieHeader) {
    responseHeaders.append('Set-Cookie', cookieHeader);
  }

  const response = new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });

  return response;
}

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { context },
) => {
  const cookieHeader = await context.authSessionService.commitSession();
  if (cookieHeader) {
    response.headers.append('Set-Cookie', cookieHeader);
  }
  return response;
};

// We have some Remix apps in the wild already running with isbot@3 so we need
// to maintain backwards compatibility even though we want new apps to use
// isbot@4.  That way, we can ship this as a minor Semver update to @remix-run/dev.
function isBotRequest(userAgent: string | null) {
  if (!userAgent) {
    return false;
  }

  // isbot >= 3.8.0, >4
  if ('isbot' in isbotModule && typeof isbotModule.isbot === 'function') {
    return isbotModule.isbot(userAgent);
  }

  // isbot < 3.8.0
  if ('default' in isbotModule && typeof isbotModule.default === 'function') {
    return isbotModule.default(userAgent);
  }

  return false;
}
