import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const clientId = 'f5aa2f20e42d783654b8e8c01bfc6312';
//redirectUri는 등록된 redirectUri중에 임의로 사용했습니다.
const redirectUri = 'http://localhost:5173/oauth/kakao';

//이용자의 uuid를 받아와 state값으로 사용합니다.
const getUserUUID = (): string => uuidv4();
const userUUID = getUserUUID();

const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${userUUID}`;

const KakaoLoginButton: React.FC = () => (
  <a href={kakaoAuthUrl}>
    <button>카카오로 로그인</button>
  </a>
);

export default KakaoLoginButton;
