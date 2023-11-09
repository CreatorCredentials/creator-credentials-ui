import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { withAuth } from '@/components/modules/app';
import { UserRole } from '@/shared/typings/UserRole';
import { authOptions } from './api/auth/[...nextauth]';

const HomePage: NextPage = () => null;

export const getServerSideProps = withAuth(
  async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    return {
      redirect: {
        destination:
          session && session.user
            ? session.user.role === UserRole.Creator
              ? '/creator'
              : '/issuer'
            : '/welcome',
        permanent: false,
      },
    };
  },
) satisfies GetServerSideProps;

export default HomePage;
