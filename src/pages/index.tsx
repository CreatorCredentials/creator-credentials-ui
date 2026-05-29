import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { withAuth } from '@/components/modules/app/withAuth';
import { UserRole } from '@/shared/typings/UserRole';

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
          ? user.publicMetadata.role === UserRole.Issuer
            ? '/issuer'
            : '/creator'
          : '/welcome',
        permanent: false,
      },
    };
  },
) satisfies GetServerSideProps;

export default HomePage;
