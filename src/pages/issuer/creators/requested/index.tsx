import { GetServerSideProps } from 'next';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { withAuth } from '@/components/modules/app';
import { UserRole } from '@/shared/typings/UserRole';

const IssuerRequestedCreatorsPage: NextPageWithLayout = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-2xl">Requested Creators Page</h1>
    </div>
  );
};

export const getServerSideProps = withAuth(
  async (ctx) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale)),
      },
    };
  },
  {
    roles: [UserRole.Issuer],
  },
) satisfies GetServerSideProps;

export default IssuerRequestedCreatorsPage;
