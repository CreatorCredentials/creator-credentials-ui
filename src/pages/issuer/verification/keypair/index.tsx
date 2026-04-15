import { GetServerSideProps } from 'next';
import { withAuth } from '@/components/modules/app';
import { KeypairVerificationContextProvider } from '@/components/modules/verification/keypair/KeypairVerificationContext';
import { KeypairVerificationFormWrapper } from '@/components/modules/verification/keypair/KeypairVerificationFormWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';

const IssuerKeypairVerificationPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader
        title="Keypair Verification"
        subtitle="Register your own cryptographic keypair as an alternative DID identifier"
        closeButtonHref="/issuer/verification"
      />
      <KeypairVerificationContextProvider>
        <KeypairVerificationFormWrapper />
      </KeypairVerificationContextProvider>
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

export default IssuerKeypairVerificationPage;
