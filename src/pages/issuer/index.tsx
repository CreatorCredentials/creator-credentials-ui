import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { withAuth } from '@/components/modules/app';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';

const IssuerHomePage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  return (
    <main className="flex flex-1 flex-col gap-5">
      <h1>Issuer Home Page</h1>
    </main>
  );
};

export const getServerSideProps = withAuth(
  async (ctx: GetServerSidePropsContext) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, ['home', 'home-issuer'])),
      },
    };
  },
  {
    roles: UserRole.Issuer,
  },
) satisfies GetServerSideProps;

export default IssuerHomePage;
