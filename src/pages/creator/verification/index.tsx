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

const CreatorVerificationPage: NextPageWithLayout = () => {
  const { t } = useTranslation('verification-creator');

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header className="flex flex-col gap-4 text-black">
        <h1 className="text-2xl">{t('header.title')}</h1>
        <h2 className="text-lg">{t('header.subtitle')}</h2>
      </header>
      <section className="grid grid-cols-3 gap-4">
        <EmailVerificationCard email="test@creator.info" />
        <MetamaskVerificationCard />
        <DomainVerificationCard />
      </section>
    </main>
  );
};

CreatorVerificationPage.getLayout = (page: ReactElement) => {
  return (
    <LazyMetaMaskProvider>
      <SidebarLayout>{page}</SidebarLayout>
    </LazyMetaMaskProvider>
  );
};

export const getServerSideProps = withAuth(async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale, ['verification-creator', 'metamask'])),
    },
  };
}) satisfies GetServerSideProps;

export default CreatorVerificationPage;
