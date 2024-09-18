import { Api } from '@/models/api';

export const api_loginWithOauth = new Api<
  { oauthKey: string },
  {
    userId: number;
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  }
>({
  method: 'GET',
  endpoint: '/oauth2/token',
  needToLogin: false,
  request: (variables) => ({
    queryParams: {
      oauthKey: variables.oauthKey,
    },
  }),
});
