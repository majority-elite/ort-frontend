import React, { useEffect, useState } from 'react';
import useEnv from '@/hooks/useEnv';
import { getUUID } from '@/utils/random';

const KakaoLoginButton: React.FC = () => {
  const env = useEnv();
  const [kakaoAuthUrl, setKakaoAuthUrl] = useState('');

  useEffect(() => {
    const userUUID = getUUID();
    const redirectUri = window.location.origin + '/oauth/kakao';
    setKakaoAuthUrl(
      `https://kauth.kakao.com/oauth/authorize?client_id=${env.KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&state=${userUUID}`,
    );
  }, [env.KAKAO_CLIENT_ID]);

  return (
    <a href={kakaoAuthUrl}>
      <button>카카오로 로그인</button>
    </a>
  );
};

export default KakaoLoginButton;
