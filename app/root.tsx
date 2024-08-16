import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { type ReactNode } from 'react';

import './root.css';
import '@/styles/theme.css';

export const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="ko">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

const App = () => <Outlet />;

export default App;
