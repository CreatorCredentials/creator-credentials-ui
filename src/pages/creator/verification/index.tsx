import { Spinner } from 'flowbite-react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { withAuth } from '@/components/modules/app';
import { DomainVerificationCard } from '@/components/modules/verification/DomainVerificationCard';
import { EmailVerificationCard } from '@/components/modules/verification/EmailVerificationCard';
import { MetamaskVerificationCard } from '@/components/modules/verification/MetamaskVerificationCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { useCreatorVerifiedCredentials } from '@/api/queries/useCreatorVerifiedCredentials';

const CreatorVerificationPage: NextPageWithLayout = () => {
  const { t } = useTranslation('verification-creator');

  const { data: verifiedCredentials, isFetching } =
    useCreatorVerifiedCredentials();

  return (
    <>
      <PageHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />
      {isFetching ? (
        <Spinner
          size="xl"
          className="absolute inset-0 m-auto"
        />
      ) : (
        <section className="grid grid-cols-3 gap-4">
          <EmailVerificationCard email={verifiedCredentials!.email} />
          <MetamaskVerificationCard
            walletAddress={verifiedCredentials?.metaMask}
          />
          <DomainVerificationCard {...verifiedCredentials?.domain} />
        </section>
      )}
    </>
  );
};

export const getServerSideProps = withAuth(
  async (ctx) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, [
          'verification-creator',
          'metamask',
        ])),
      },
    };
  },
  {
    roles: [UserRole.Creator],
  },
) satisfies GetServerSideProps;

export default CreatorVerificationPage;
