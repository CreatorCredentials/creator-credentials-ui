import { GetServerSideProps } from 'next';
import { useTranslation } from '@/shared/utils/useTranslation';
import { withAuth } from '@/components/modules/app/withAuth';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { AdminVerify } from '@/components/modules/admin/AdminVerify';

const AdminVerifyPage: NextPageWithLayout = () => {
  const { t } = useTranslation('admin');

  return (
    <>
      <PageHeader
        title={t('verify.header.title')}
        subtitle={t('verify.header.description')}
      />
      <AdminVerify />
    </>
  );
};

export const getServerSideProps = withAuth(
  async (ctx) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, ['admin'])),
      },
    };
  },
  {
    roles: [UserRole.Admin],
  },
) satisfies GetServerSideProps;

export default AdminVerifyPage;
