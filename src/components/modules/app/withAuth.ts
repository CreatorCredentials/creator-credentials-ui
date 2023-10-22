import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getSession } from 'next-auth/react';
import { SessionError } from '@/shared/typings/SessionError';

export function withAuth<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
  options?: {
    redirect?: string;
  },
) {
  return async function withAuthUserTokenSSR(
    context: GetServerSidePropsContext,
  ) {
    const session = await getSession(context);

    if (!session || session.error === SessionError.RefreshAccessTokenError) {
      return {
        redirect: {
          destination: options?.redirect || '/welcome',
          statusCode: 302,
        },
      } as GetServerSidePropsResult<P>;
    }

    return handler(context);
  };
}
