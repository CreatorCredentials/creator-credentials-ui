import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { withAuth } from '@/components/modules/app';
import { UserRole } from '@/shared/typings/UserRole';

const HomePage: NextPage = () => null;

export const getServerSideProps = withAuth(
  async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

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
