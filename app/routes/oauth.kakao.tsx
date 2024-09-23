import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { redirectWithAuthCookie } from '@/utils/server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { origin } = url;

  return redirectWithAuthCookie(
    `${import.meta.env.SERVER_API_URL}/oauth2/authorization/kakao?redirect_to=${origin}/oauth`,
    context.authSessionService,
  );
};
