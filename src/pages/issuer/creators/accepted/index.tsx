import { GetServerSideProps } from 'next';
import { useTranslation } from '@/shared/utils/useTranslation';
import { withAuth } from '@/components/modules/app/withAuth';
import { IssuerAcceptedCreators } from '@/components/modules/creators/IssuerAcceptedCreators';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { useIsDataSupplierIssuer } from '@/shared/hooks/useIsDataSupplierIssuer';

const IssuerAcceptedCreatorsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('issuer-creators');
  const isDataSupplierIssuer = useIsDataSupplierIssuer();

  return (
    <>
      <PageHeader
        title={t(
          isDataSupplierIssuer
            ? 'accepted.header.title-data-supplier'
            : 'accepted.header.title',
        )}
        subtitle={t(
          isDataSupplierIssuer
            ? 'accepted.header.description-data-supplier'
            : 'accepted.header.description',
        )}
      />
      <IssuerAcceptedCreators />
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

export default IssuerAcceptedCreatorsPage;
