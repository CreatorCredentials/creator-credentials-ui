import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { clerkClient as clerkClientBackend } from '@clerk/nextjs/server';
import { UserRole } from '@/shared/typings/UserRole';

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
    const auth = getAuth(context.req);

    const { userId } = auth;
    if (!userId) {
      return {
        redirect: {
          destination: options?.redirect || '/welcome',
          statusCode: 302,
        },
      } as GetServerSidePropsResult<P>;
    }

    try {
      const user = await clerkClient.users.getUser(userId);

      const userRoleFromMetadata = user.publicMetadata.role;
      if (
        userRoleFromMetadata !== UserRole.Creator &&
        userRoleFromMetadata !== UserRole.Issuer
      ) {
        const route = context.req.url;
        if (route === '/creator' || route === '/issuer') {
          await clerkClientBackend.users.updateUserMetadata(userId, {
            publicMetadata: {
              role: route === '/creator' ? UserRole.Creator : UserRole.Issuer,
            },
          });
        }
      }

      if (
        user.publicMetadata.role &&
        options?.roles &&
        !isUserRoleEligible(user.publicMetadata.role as UserRole, options.roles)
      ) {
        return {
          redirect: {
            destination:
              options?.redirect ||
              (user.publicMetadata.role === UserRole.Creator
                ? '/creator'
                : '/issuer'),
            statusCode: 302,
          },
        } as GetServerSidePropsResult<P>;
      }

      return handler(context);
    } catch (error) {
      return {
        redirect: {
          destination: options?.redirect || '/welcome',
          statusCode: 302,
        },
      } as GetServerSidePropsResult<P>;
    }
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
