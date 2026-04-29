import { GetServerSideProps } from 'next';
import { withAuth } from '@/components/modules/app/withAuth';
import { CertVerificationContextProvider } from '@/components/modules/verification/cert/CertVerificationContext';
import { CertVerificationFormWrapper } from '@/components/modules/verification/cert/CertVerificationFormWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';

const IssuerCertVerificationPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader
        title="X.509 Certificate Import"
        subtitle="Import your own X.509 certificate to use when signing credentials"
        closeButtonHref="/issuer/verification"
      />
      <CertVerificationContextProvider>
        <CertVerificationFormWrapper />
      </CertVerificationContextProvider>
    </>
  );
};

export const getServerSideProps = withAuth(
  async (ctx) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, ['common'])),
      },
    };
  },
  { roles: [UserRole.Issuer] },
) satisfies GetServerSideProps;

export default IssuerCertVerificationPage;
