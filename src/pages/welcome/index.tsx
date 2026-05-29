import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import { UserCard } from '@/components/modules/welcome/UserCard/UserCard';
import { WelcomeHeader } from '@/components/modules/welcome/WelcomeHeader/WelcomeHeader';
import { LinkButton } from '@/components/shared/LinkButton';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { UserRole } from '@/shared/typings/UserRole';

const WelcomePage: NextPageWithLayout = () => {
  const { t } = useTranslation('welcome');
  const router = useRouter();
  const user = useUser();
  const [showIssuerCard, setShowIssuerCard] = useState(false);

  useEffect(() => {
    if (window.self !== window.top) {
      router.push('auth/iframe/creator');
      return;
    }
    if (!user.isSignedIn) return;

    const role = user.user?.publicMetadata.role;
    if (role === UserRole.Issuer) {
      router.push('/issuer');
    } else {
      // Creator role or no role yet - send to creator dashboard.
      // withAuth there will assign the role via Clerk metadata if missing.
      router.push('/creator');
    }
  }, [user, router]);

  return (
    <>
      <div className="fixed right-4 top-4 z-10">
        <Button
          color="light"
          size="xs"
          className="uppercase"
          onClick={() => setShowIssuerCard((prevState) => !prevState)}
        >
          {showIssuerCard ? t('creator.title') : t('issuer.title')}
        </Button>
      </div>
      <WelcomeHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <section className="flex flex-wrap justify-center gap-6">
        {showIssuerCard ? (
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
        ) : (
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
        )}
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
