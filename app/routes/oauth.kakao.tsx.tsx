import { LoaderFunction, json } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // 이 아래의 try문 지우고 이어서 하면 됩니다
  try {
    console.log(code, state);
  } catch {
    console.log(json);
  }
};

const KakaoRedirect = () => <div>카카오 로그인 중...</div>;

export default KakaoRedirect;
