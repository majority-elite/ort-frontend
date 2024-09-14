import React, { useEffect, useState } from 'react';
import useEnv from '@/hooks/useEnv';

const KakaoLoginButton: React.FC = () => {
  const env = useEnv();
  const [kakaoAuthUrl, setKakaoAuthUrl] = useState('');

  useEffect(() => {
    const redirectUri =
      window.location.origin.replace('localhost', '127.0.0.1') + '/oauth/kakao';
    setKakaoAuthUrl(
      `${env.API_URL}/oauth2/authorization/kakao?redirect_to=${redirectUri}`,
    );
    // setKakaoAuthUrl('http://146.56.161.252:8080/oauth2/authorization/kakao');
  }, [env.API_URL]);

  return (
    <a href={kakaoAuthUrl}>
      <button>카카오로 로그인</button>
    </a>
  );
};

export default KakaoLoginButton;
