import { type LoaderFunctionArgs } from '@remix-run/cloudflare';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  console.log(code, state);

  return null;
};

const KakaoRedirect = () => <div>카카오 로그인 중...</div>;

export default KakaoRedirect;
