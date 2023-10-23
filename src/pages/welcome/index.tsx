import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import { UserCard } from '@/components/modules/welcome/UserCard/UserCard';
import { WelcomeHeader } from '@/components/modules/welcome/WelcomeHeader/WelcomeHeader';
import { LinkButton } from '@/components/shared/LinkButton';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';

const WelcomePage: NextPageWithLayout = () => {
  const { t } = useTranslation('welcome');

  return (
    <main className="flex flex-1 flex-col items-center gap-20 pt-32">
      <WelcomeHeader
        title={t('title')}
        subTitle={t('subtitle')}
      />
      <section className="flex flex-wrap justify-center gap-6">
        <UserCard
          title={t('issuer.title')}
          subtitle={t('issuer.description')}
        >
          <LinkButton
            href="/auth/signup/creator"
            color="secondary"
          >
            {t('login', { ns: 'common' })}
          </LinkButton>
        </UserCard>
        <UserCard
          title={t('creator.title')}
          subtitle={t('creator.description')}
        >
          <LinkButton
            href="/auth/signup/creator"
            color="primary"
          >
            {t('login', { ns: 'common' })}
          </LinkButton>
        </UserCard>
      </section>
    </main>
  );
};

WelcomePage.getLayout = (page: ReactElement) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale, ['welcome'])),
    },
  };
}) satisfies GetServerSideProps;

export default WelcomePage;
