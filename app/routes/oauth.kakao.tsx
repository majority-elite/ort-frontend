import { type LoaderFunctionArgs } from '@remix-run/cloudflare';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers;
  console.log(cookieHeader);

  return null;
};

const KakaoRedirect = () => {
  console.log('kakaoredirect');

  return (
    <div>
      {/* <p className={textStyle.headline1B}>{fetcher.state}</p>
      <fetcher.Form method="POST">
        <button type="submit">test submit</button>
      </fetcher.Form> */}
    </div>
  );
};

export default KakaoRedirect;
