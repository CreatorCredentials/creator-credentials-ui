import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { HOME_PATH_BY_ROLE, UserRole } from '@/shared/typings/UserRole';

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

      if (!isKnownRole(userRoleFromMetadata)) {
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
        // The admin area does not exist for other roles; everyone else is
        // sent to the home page of their own role.
        if (isAdminOnly(options.roles)) {
          return { notFound: true } as GetServerSidePropsResult<P>;
        }
        return {
          redirect: {
            destination:
              options?.redirect ||
              homePathFor(user.publicMetadata.role as UserRole),
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

const isKnownRole = (role: unknown): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

const homePathFor = (role: UserRole): string =>
  HOME_PATH_BY_ROLE[role] ?? HOME_PATH_BY_ROLE[UserRole.Creator];

const isAdminOnly = (eligibleRoles: UserRole | UserRole[]): boolean =>
  Array.isArray(eligibleRoles)
    ? eligibleRoles.every((role) => role === UserRole.Admin)
    : eligibleRoles === UserRole.Admin;

const isUserRoleEligible = (
  userRole: UserRole,
  eligibleRoles: UserRole | UserRole[],
) => {
  if (Array.isArray(eligibleRoles)) {
    return eligibleRoles.includes(userRole);
  }
  return userRole === eligibleRoles;
};
