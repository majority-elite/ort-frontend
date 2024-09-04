import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { EnvContext } from '@/contexts/EnvContext';

import './root.css';
import '@/styles/theme.css';

export const loader = async (args: LoaderFunctionArgs) =>
  json({
    env: args.context.clientEnv,
  });

const App = () => {
  const data = useLoaderData<typeof loader>();

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
        </EnvContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default App;
