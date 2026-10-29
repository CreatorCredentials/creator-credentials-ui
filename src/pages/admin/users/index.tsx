import { GetServerSideProps } from 'next';
import { useTranslation } from '@/shared/utils/useTranslation';
import { withAuth } from '@/components/modules/app/withAuth';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { AdminUsers } from '@/components/modules/admin/AdminUsers';

const AdminUsersPage: NextPageWithLayout = () => {
  const { t } = useTranslation('admin');

  return (
    <>
      <PageHeader
        title={t('users.header.title')}
        subtitle={t('users.header.description')}
      />
      <AdminUsers />
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

export default AdminUsersPage;
