import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { withAuth } from '@/components/modules/app/withAuth';
import { HOME_PATH_BY_ROLE, UserRole } from '@/shared/typings/UserRole';

const HomePage: NextPage = () => null;

export const getServerSideProps = withAuth(
  async (ctx: GetServerSidePropsContext) => {
    const { userId } = getAuth(ctx.req);

    if (!userId) {
      return {
        redirect: {
          destination: '/welcome',
          permanent: false,
        },
      };
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return {
      redirect: {
        destination: user
          ? (HOME_PATH_BY_ROLE[user.publicMetadata.role as UserRole] ??
            HOME_PATH_BY_ROLE[UserRole.Creator])
          : '/welcome',
        permanent: false,
      },
    };
  },
) satisfies GetServerSideProps;

export default HomePage;
