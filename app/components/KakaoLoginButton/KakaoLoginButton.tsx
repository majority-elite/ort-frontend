import React, { useMemo } from 'react';
import getUUID from '@/utils/getUUID';

const clientId = 'f5aa2f20e42d783654b8e8c01bfc6312';
//redirectUri는 등록된 redirectUri중에 임의로 사용했습니다.
const redirectUri = 'http://localhost:5173/oauth/kakao';

const KakaoLoginButton: React.FC = () => {
  const kakaoAuthUrl = useMemo(() => {
    const userUUID = getUUID();
    return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${userUUID}`;
  }, []);

  return (
    <a href={kakaoAuthUrl}>
      <button>카카오로 로그인</button>
    </a>
  );
};

export default KakaoLoginButton;
