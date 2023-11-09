import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getServerSession } from 'next-auth';
import { SessionError } from '@/shared/typings/SessionError';
import { UserRole } from '@/shared/typings/UserRole';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

export function withAuth<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
  options?: {
    redirect?: string;
    roles?: UserRole | UserRole[];
  },
) {
  return async function withAuthUserTokenSSR(
    context: GetServerSidePropsContext,
  ) {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (
      !session ||
      session.error === SessionError.RefreshAccessTokenError ||
      (options?.roles && !isUserRoleEligible(session.user.role, options.roles))
    ) {
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

const isUserRoleEligible = (
  userRole: UserRole,
  eligibleRoles: UserRole | UserRole[],
) => {
  if (Array.isArray(eligibleRoles)) {
    return eligibleRoles.includes(userRole);
  }

  return userRole === eligibleRoles;
};
