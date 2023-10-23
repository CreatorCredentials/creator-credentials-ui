import { GetServerSideProps } from 'next';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { withAuth } from '@/components/modules/app';

const VerificationPage: NextPageWithLayout = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl">Verification Page</h1>
    </main>
  );
};

export const getServerSideProps = withAuth(async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale)),
    },
  };
}) satisfies GetServerSideProps;

export default VerificationPage;
