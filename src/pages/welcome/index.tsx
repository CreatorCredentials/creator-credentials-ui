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
    <>
      <WelcomeHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <section className="flex flex-wrap justify-center gap-6">
        <UserCard
          title={t('issuer.title')}
          subtitle={t('issuer.description')}
          iconName="AssuredWorkload"
        >
          <LinkButton
            href="/auth/login/issuer"
            color="primary"
          >
            {t('log-in', { ns: 'common' })}
          </LinkButton>
          <LinkButton
            href="/auth/signup/issuer"
            color="outline"
          >
            {t('sign-up', { ns: 'common' })}
          </LinkButton>
        </UserCard>
        <UserCard
          title={t('creator.title')}
          subtitle={t('creator.description')}
          iconName="DesignServices"
        >
          <LinkButton
            href="/auth/login/creator"
            color="primary"
          >
            {t('log-in', { ns: 'common' })}
          </LinkButton>
          <LinkButton
            href="/auth/signup/creator"
            color="outline"
          >
            {t('sign-up', { ns: 'common' })}
          </LinkButton>
        </UserCard>
      </section>
    </>
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
