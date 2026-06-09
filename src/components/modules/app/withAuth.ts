import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
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
    try {
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

      // v6: `clerkClient` is now an async factory - must be invoked to get
      // the backend client instance.
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      const userRoleFromMetadata = user.publicMetadata.role;

      if (
        userRoleFromMetadata !== UserRole.Creator &&
        userRoleFromMetadata !== UserRole.Issuer
      ) {
        const route = context.req.url;
        let newRole = null;
        if (route?.includes('issuer')) newRole = UserRole.Issuer;
        if (route?.includes('creator')) newRole = UserRole.Creator;

        if (newRole) {
          await client.users.updateUserMetadata(userId, {
            publicMetadata: {
              role: newRole,
            },
          });
        }
      }

      // If the user accepted ToS during sign-up (stored in a short-lived cookie),
      // write it to Clerk publicMetadata so the backend webhook can verify it.
      const pendingTosLink = context.req.cookies?.pendingTosLink;
      if (pendingTosLink && !user.publicMetadata.termsAreAccepted) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            termsAreAccepted: true,
            termsLink: decodeURIComponent(pendingTosLink),
          },
        });
        // Clear the cookie so it isn't reprocessed on subsequent requests.
        context.res.setHeader(
          'Set-Cookie',
          'pendingTosLink=; Path=/; Max-Age=0; SameSite=Lax',
        );
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
