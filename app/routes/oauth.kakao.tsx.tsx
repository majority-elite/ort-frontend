import { LoaderFunction, json } from '@remix-run/cloudflare';
import axios, { AxiosError } from 'axios';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  try {
    const response = await axios.post('(백엔드api url)', {
      code,
      state,
    });
    return json({ message: 'Success', data: response.data });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error sending code to backend:', axiosError);
    return json({ message: 'Error', error: axiosError.message });
  }
};

const KakaoRedirect = () => <div>카카오 로그인 중...</div>;

export default KakaoRedirect;
