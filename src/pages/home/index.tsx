import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { withAuth } from '@/components/modules/app';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';

const HomePage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl">Home Page</h1>
    </main>
  );
};

export const getServerSideProps = withAuth(
  async (ctx: GetServerSidePropsContext) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale)),
      },
    };
  },
) satisfies GetServerSideProps;

export default HomePage;
