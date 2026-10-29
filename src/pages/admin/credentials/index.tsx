import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from '@/shared/utils/useTranslation';
import { withAuth } from '@/components/modules/app/withAuth';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { AdminCredentials } from '@/components/modules/admin/AdminCredentials';
import { adminCredentialsFiltersFromQuery } from '@/components/modules/admin/AdminCredentials/adminCredentialsFilters';

const AdminCredentialsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('admin');
  const { query } = useRouter();

  return (
    <>
      <PageHeader
        title={t('credentials.header.title')}
        subtitle={t('credentials.header.description')}
      />
      <AdminCredentials
        initialFilters={adminCredentialsFiltersFromQuery(query)}
      />
    </>
  );
};

export const getServerSideProps = withAuth(
  async (ctx) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, ['admin', 'cards'])),
      },
    };
  },
  {
    roles: [UserRole.Admin],
  },
) satisfies GetServerSideProps;

export default AdminCredentialsPage;
