import { GetServerSideProps } from 'next';
import { useTranslation } from '@/shared/utils/useTranslation';
import { withAuth } from '@/components/modules/app/withAuth';
import { IssuerRequestedCreators } from '@/components/modules/creators/IssuerRequestedCreators';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { useIsDataSupplierIssuer } from '@/shared/hooks/useIsDataSupplierIssuer';

const IssuerRequestedCreatorsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('issuer-creators');
  const isDataSupplierIssuer = useIsDataSupplierIssuer();

  return (
    <>
      <PageHeader
        title={t(
          isDataSupplierIssuer
            ? 'requested.header.title-data-supplier'
            : 'requested.header.title',
        )}
        subtitle={t(
          isDataSupplierIssuer
            ? 'requested.header.description-data-supplier'
            : 'requested.header.description',
        )}
      />
      <IssuerRequestedCreators />
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

export default IssuerRequestedCreatorsPage;
