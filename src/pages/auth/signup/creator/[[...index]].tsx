import { SignUp } from '@clerk/nextjs';
import { GetServerSideProps } from 'next';
import { ReactElement, useState } from 'react';
import { Button, Checkbox } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { BaseAuthFormCard } from '@/components/modules/authorization/BaseAuthFormCard';
import { WelcomeHeader } from '@/components/modules/welcome/WelcomeHeader/WelcomeHeader';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import { config } from '@/shared/constants/config';
import { setPendingTosLinkCookie } from '@/shared/utils/tos';

const CreatorSignupPage: NextPageWithLayout = () => {
  const { t } = useTranslation('creator-signup');
  const [tosAccepted, setTosAccepted] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleAcceptAndContinue = () => {
    setPendingTosLinkCookie(config.CREATOR_TERMS_URL);
    setShowSignUp(true);
  };

  return (
    <>
      <WelcomeHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <BaseAuthFormCard
        title={t('title')}
        subtitle={
          showSignUp
            ? t('card.description')
            : 'Please review and accept the Terms of Service to continue.'
        }
      >
        {showSignUp ? (
          <SignUp
            forceRedirectUrl={'/creator'}
            signInUrl={'/auth/login/creator'}
          />
        ) : (
          <div className="flex flex-col gap-6 px-6 py-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="creator-tos"
                checked={tosAccepted}
                onChange={(e) => setTosAccepted(e.target.checked)}
                className="mt-0.5 shrink-0"
              />
              <label
                htmlFor="creator-tos"
                className="cursor-pointer text-sm font-medium text-gray-700"
              >
                I agree to the{' '}
                <a
                  href={config.CREATOR_TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-[3px]"
                >
                  Terms of Service
                </a>
              </label>
            </div>
            <Button
              color="primary"
              disabled={!tosAccepted}
              onClick={handleAcceptAndContinue}
            >
              Continue to Sign Up
            </Button>
          </div>
        )}
      </BaseAuthFormCard>
    </>
  );
};

CreatorSignupPage.getLayout = (page: ReactElement) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale, [
        'creator-signup',
        'terms-and-conditions',
      ])),
    },
  };
}) satisfies GetServerSideProps;

export default CreatorSignupPage;
