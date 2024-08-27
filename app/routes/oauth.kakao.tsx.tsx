//HTTP 요청을 보내기 위해 axios라이브러리를 추가했습니다.
import { LoaderFunction, json } from '@remix-run/cloudflare';
import { useSearchParams } from '@remix-run/react';
import axios, { AxiosError } from 'axios';
import { useEffect } from 'react';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  /**
   * code와 state 값을 추출하여 axios.post를 사용해 백엔드 서버에 요청을 보냅니다.
   * 요청 성공 시 성공 메시지와 반환된 데이터를 JSON 형태로 반환합니다.
   * 요청 실패 시 오류 메시지를 JSON 형태로 반환하고 콘솔에 오류를 출력합니다.
   */
  try {
    //추후에 진짜 백엔드 api url로 변경예정입니다.
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

/**
 * @constructor KakaoRedirect 함수는 카카오 로그인 후 리다이렉트된 페이지에서 실행되는 컴포넌트입니다.
 * @useSearchParams 훅을 사용해 URL 쿼리 파라미터를 가져옵니다.
 * @useEffect 훅을 사용해 컴포넌트가 마운트될 때 실행되는 코드를 작성합니다.
 * @sendCodeToServer 쿼리 파라미터에서 code와 state를 추출하고, 이 값을 url.searchParams 객체에 추가한 후, /oauth/kakao 엔드포인트로 POST 요청을 보냅니다.
 */
const KakaoRedirect = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sendCodeToServer = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code) {
        const formData = new FormData();
        formData.append('code', code);
        if (state) {
          formData.append('state', state);
        }

        try {
          const response = await fetch('/oauth/kakao', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          console.log('Server response:', data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    sendCodeToServer();
  }, [searchParams]);

  return <div>카카오 로그인 중...</div>;
};

export default KakaoRedirect;
