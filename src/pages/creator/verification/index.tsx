import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { SidebarLayout } from '@/components/layouts/sidebarLayout/SidebarLayout';
import { withAuth } from '@/components/modules/app';
import { DomainVerificationCard } from '@/components/modules/verification/DomainVerificationCard';
import { EmailVerificationCard } from '@/components/modules/verification/EmailVerificationCard';
import { MetamaskVerificationCard } from '@/components/modules/verification/MetamaskVerificationCard';
import { LazyMetaMaskProvider } from '@/components/shared/LazyMetaMaskProvider';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { PageHeader } from '@/components/shared/PageHeader';
import { UserRole } from '@/shared/typings/UserRole';

const CreatorVerificationPage: NextPageWithLayout = () => {
  const { t } = useTranslation('verification-creator');

  return (
    <>
      <PageHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />
      <section className="grid grid-cols-3 gap-4">
        <EmailVerificationCard email="test@creator.info" />
        <MetamaskVerificationCard />
        <DomainVerificationCard />
      </section>
    </>
  );
};

CreatorVerificationPage.getLayout = (page: ReactElement) => {
  return (
    <LazyMetaMaskProvider>
      <SidebarLayout>{page}</SidebarLayout>
    </LazyMetaMaskProvider>
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
