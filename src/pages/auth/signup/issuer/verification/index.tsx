import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import {
  IssuerSignupContextProvider,
  useIssuerSignupContext,
} from '@/components/modules/authorization/issuer/IssuerSignupContext/IssuerSignupContext';
import { AuthVerificationCard } from '@/components/modules/authorization/AuthVerificationCard/AuthVerificationCard';
import { useSignupIssuer } from '@/api/mutations/useSignupIssuer';
import { mapIssuerSignupContextFormStepsToPayload } from '@/components/modules/authorization/issuer/mapIssuerSignupContextFormStepsToPayload';
import { useToast } from '@/shared/hooks/useToast';
import { WelcomeHeader } from '@/components/modules/welcome/WelcomeHeader/WelcomeHeader';
import { UserRole } from '@/shared/typings/UserRole';

const IssuerSignupVerificationPage: NextPageWithLayout = () => {
  const { t } = useTranslation('issuer-signup');
  const router = useRouter();
  const toast = useToast();

  const { formSteps } = useIssuerSignupContext();
  const { mutateAsync, isLoading } = useSignupIssuer();

  const goBackHandler = () => {
    router.push('/auth/signup/issuer/email');
  };

  const resendVerificationEmailHandler = async () => {
    try {
      await mutateAsync(mapIssuerSignupContextFormStepsToPayload(formSteps));
    } catch (err) {
      toast.error(t('errors.send-email'));
    }
  };

  return (
    <>
      <WelcomeHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />
      <AuthVerificationCard
        title={t('steps.verification.title')}
        subtitle={t('steps.verification.subtitle')}
        userRole={UserRole.Issuer}
        goBackHandler={goBackHandler}
        resendVerificationEmailHandler={resendVerificationEmailHandler}
        isLoading={isLoading}
      />
    </>
  );
};

IssuerSignupVerificationPage.getLayout = (page: ReactElement) => {
  return (
    <IssuerSignupContextProvider>
      <BlankLayout>{page}</BlankLayout>
    </IssuerSignupContextProvider>
  );
};

export const getServerSideProps = (async (ctx) => {
  if (!ctx.req.headers.referer) {
    return {
      redirect: {
        destination: '/auth/signup/issuer',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await getI18nProps(ctx.locale, ['signup', 'issuer-signup'])),
    },
  };
}) satisfies GetServerSideProps;

export default IssuerSignupVerificationPage;
