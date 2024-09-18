import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { api_loginWithOauth } from '@/apis/auth';
import { redirectWithAuthCookie } from '@/utils/server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const oauthKey = url.searchParams.get('oauthKey');
  if (!oauthKey) {
    throw new Error('No oauthKey provided');
  }

  const { result } = await api_loginWithOauth.fetch({ oauthKey }, context, {
    throwOnError: true,
  });

  await context.authSessionService.updateAuthToken({
    accessToken: result.accessToken,
    accessTokenExpiresAt: result.accessTokenExpiresAt,
    refreshToken: result.refreshToken,
    refreshTokenExpiresAt: result.refreshTokenExpiresAt,
  });

  return redirectWithAuthCookie('/', context.authSessionService);
};
