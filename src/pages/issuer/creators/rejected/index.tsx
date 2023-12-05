import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { withAuth } from '@/components/modules/app';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { IssuerRejectedCreators } from '@/components/modules/creators/IssuerRejectedCreators';

const IssuerRejectedCreatorsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('issuer-creators');

  return (
    <>
      <PageHeader
        title={t('rejected.header.title')}
        subtitle={t('rejected.header.description')}
      />
      <IssuerRejectedCreators />
    </>
  );
};

export const getServerSideProps = withAuth(
  async (ctx) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, ['issuer-creators'])),
      },
    };
  },
  {
    roles: [UserRole.Issuer],
  },
) satisfies GetServerSideProps;

export default IssuerRejectedCreatorsPage;
