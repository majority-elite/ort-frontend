import { Api } from '@/models/api';

export const api_loginWithKakao = new Api<
  { code: string; state: string },
  {
    userId: number;
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  }
>({
  method: 'POST',
  endpoint: '/login/oauth2/code/kakao',
  needToLogin: false,
  request: (variables) => ({
    queryParams: {
      code: variables.code,
      state: variables.state,
    },
  }),
});
