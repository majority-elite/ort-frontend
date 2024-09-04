## About

`server` 디렉토리는 Cloudflare 런타임 환경에 돌아갈 기능 등 서버와 관련이 있는 코드가 있는 곳이다.

## ⚠️ Caution: Absolute Path

`server` 내에서는 절대 경로(absolute path)를 사용하여 import하면 안 된다.

Vite 플러그인 등 절대 경로가 적용되기 전에 평가되어야 하는 코드가 있기 때문에, 절대 경로를 사용하면 module resolution 오류가 발생한다.

```typescript
// error
import { clientEnvSchema } from '@server/constants/env';

// ok
import { clientEnvSchema } from '../constants/env';
```

그러나 `server` 외부에서는 사용해도 대부분 괜찮다.

```typescript
// app/hooks/useEnv.tsx

// ok
import { type ClientEnv, clientEnvSchema } from '@server/constants/env';
```

## `remixCloudflareDevProxyVitePlugin`

Cloudflare Pages는 일반적인 Node 환경이 아니기에, `wrangler`로 실행해야 실제 배포 환경에 맞게 실행해볼 수 있다.

그러나 Remix.js는 `wrangler`를 사용하려면 먼저 빌드를 한 뒤 빌드 결과물을 실행해야 하기에, 개발 중 Live Reload가 동작하지 않는다.

[`@remix-run/dev`의 `cloudflareDevProxyVitePlugin`을 사용하면](https://remix.run/docs/en/main/guides/vite#cloudflare-proxy) `wrangler`를 사용하지 않고도 Vite 개발 환경에서 Cloudflare Pages 환경에 맞게 쓰인 코드를 문제 없이 실행할 수 있지만, 현재 프로젝트 구성상 문제가 있다.

우리 프로젝트는 `authSessionStorage`라는 cookie session storage를 생성한 뒤, `loader` 또는 `action`의 Response가 반환되기 직전에 `commitSession`을 실행해서 `Set-Cookie` header를 설정하도록 되어 있다.

```typescript
// functions/[[path]].ts

const handleRequest = createPagesFunctionHandler<ContextEnv>({
  build,
  getLoadContext: (args) => getLoadContext(authSession, args),
});

const response = await handleRequest(context);

response.headers.append(
  'Set-Cookie',
  await authSessionStorage.commitSession(authSession),
);
```

그러나 `cloudflareDevProxyVitePlugin`은 `getLoadContext`만 parameter로 받고 있어 `Response`에 접근할 수 없기에, 모든 Remix.js의 endpoint에서 매번 `commitSession`을 수행해야만 한다.

따라서 기존 플러그인 코드를 직접 수정하여 `commitSession`을 수행하도록 만들었다.

```typescript
// server/plugins/remixCloudflareDevProxyVitePlugin.ts

const res = await handler(req, loadContext);

res.headers.append(
  'Set-Cookie',
  await authSessionStorage.commitSession(authSession),
);
```
