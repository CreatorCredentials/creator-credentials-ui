import { joiResolver } from '@hookform/resolvers/joi';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import {
  IssuerSignupContextProvider,
  useIssuerSignupContext,
} from '@/components/modules/authorization/issuer/IssuerSignupContext/IssuerSignupContext';
import { IssuerSignupEmailForm } from '@/components/modules/authorization/issuer/IssuerSignupEmailForm';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { IssuerSignupEmailFormContextType } from '@/components/modules/authorization/issuer/IssuerSignupEmailForm/IssuerSignupEmailForm.types';
import { IssuerSignupEmailFormSchema } from '@/components/modules/authorization/issuer/IssuerSignupEmailForm/IssuerSignupEmailForm.schema';
import { BaseAuthFormCard } from '@/components/modules/authorization/BaseAuthFormCard';
import { Icon } from '@/components/shared/Icon';
import { useSignupIssuer } from '@/api/mutations/useSignupIssuer';
import { mapIssuerSignupContextFormStepsToPayload } from '@/components/modules/authorization/issuer/mapIssuerSignupContextFormStepsToPayload';
import { useToast } from '@/shared/hooks/useToast';
import { DefaultIssuerSignupContextFormStepsValues } from '@/components/modules/authorization/issuer/IssuerSignupContext/IssuerSignupContext.constants';
import { WelcomeHeader } from '@/components/modules/welcome/WelcomeHeader/WelcomeHeader';

const FORM_STEP = 'email';

const IssuerSignupEmailPage: NextPageWithLayout = () => {
  const { t } = useTranslation('issuer-signup');
  const router = useRouter();
  const toast = useToast();

  const { formSteps, updateStep } = useIssuerSignupContext();
  const { mutateAsync, isLoading } = useSignupIssuer();

  const form = useForm<IssuerSignupEmailFormContextType>({
    resolver: (values, context, options) => {
      const { domain } = formSteps['details'];
      const { address } = values;

      const parsedData: IssuerSignupEmailFormContextType = {
        ...values,
        address: `${address}@${domain}`,
      };

      return joiResolver(IssuerSignupEmailFormSchema)(
        parsedData,
        context,
        options,
      );
    },
    defaultValues: {
      ...formSteps[FORM_STEP],
      address: formSteps[FORM_STEP].address.split('@')[0],
    },
    mode: 'onBlur',
  });

  const { handleSubmit, watch } = form;

  const termsAndConditions = watch('termsAndConditions');

  const emailFormSubmitHandler: SubmitHandler<
    IssuerSignupEmailFormContextType
  > = async (data) => {
    try {
      updateStep('email', data);
      const details = formSteps['details'];
      await mutateAsync(
        mapIssuerSignupContextFormStepsToPayload({ details, email: data }),
      );
      router.push('/auth/signup/issuer/verification');
    } catch (err) {
      toast.error(t('errors.send-email'));
    }
  };

  const goBackHandler = () => {
    updateStep(FORM_STEP, DefaultIssuerSignupContextFormStepsValues[FORM_STEP]);
    router.push('/auth/signup/issuer');
  };

  return (
    <>
      <WelcomeHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
      />
      <section className="flex flex-col gap-5">
        <BaseAuthFormCard
          title={t('card.title')}
          subtitle={t('steps.email.subtitle')}
        >
          <FormProvider {...form}>
            <IssuerSignupEmailForm
              handleSubmit={handleSubmit(emailFormSubmitHandler)}
              className="px-[6.5rem]"
              emailInputDomain={formSteps['details'].domain}
              renderButtons={({ isValid }) => (
                <div className="flex flex-col gap-2.5">
                  <Button
                    type="submit"
                    disabled={!isValid || !termsAndConditions || isLoading}
                    isProcessing={isLoading}
                    color="primary"
                  >
                    <p>{t('send', { ns: 'common' })}</p>
                    <Icon
                      icon="ArrowRight"
                      className="ms-2"
                    />
                  </Button>
                  <Button
                    color="outline"
                    onClick={goBackHandler}
                    disabled={isLoading}
                  >
                    <Icon
                      icon="ArrowLeft"
                      className="me-2"
                    />
                    <p>{t('go-back', { ns: 'common' })}</p>
                  </Button>
                </div>
              )}
            />
          </FormProvider>
        </BaseAuthFormCard>
      </section>
    </>
  );
};

IssuerSignupEmailPage.getLayout = (page: ReactElement) => {
  return (
    <IssuerSignupContextProvider>
      <BlankLayout>{page}</BlankLayout>
    </IssuerSignupContextProvider>
  );
};

export const getServerSideProps = (async (ctx) => {
  // TODO: After removing MSW, replace the condition below with code below - it will prevent users from accessing this page directly or by refreshing the page.
  // if (!ctx.req.headers.referer?.includes('/auth/signup/issuer'))
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
      ...(await getI18nProps(ctx.locale, [
        'issuer-signup',
        'terms-and-conditions',
      ])),
    },
  };
}) satisfies GetServerSideProps;

export default IssuerSignupEmailPage;
