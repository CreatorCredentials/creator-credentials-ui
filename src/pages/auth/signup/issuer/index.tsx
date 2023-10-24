import { joiResolver } from '@hookform/resolvers/joi';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import { BaseAuthFormCard } from '@/components/modules/authorization/BaseAuthFormCard';
import { IssuerSignupDetailsForm } from '@/components/modules/authorization/issuer/IssuerSignUpDetailsForm';
import { IssuerSignupDetailsFormSchema } from '@/components/modules/authorization/issuer/IssuerSignUpDetailsForm/IssuerSignupDetailsForm.schema';
import { IssuerSignupDetailsFormContextType } from '@/components/modules/authorization/issuer/IssuerSignUpDetailsForm/IssuerSignupDetailsForm.types';
import {
  IssuerSignupContextProvider,
  useIssuerSignupContext,
} from '@/components/modules/authorization/issuer/IssuerSignupContext/IssuerSignupContext';
import { IssuerSignupFormStep } from '@/components/modules/authorization/issuer/IssuerSignupContext/IssuerSignupContext.types';
import { IssuerSignupFormStepsTabs } from '@/components/modules/authorization/issuer/IssuerSignupFormStepsTabs';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';

const FORM_STEP: IssuerSignupFormStep = 'details';

const IssuerSignupDetailsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('issuer-signup');
  const router = useRouter();

  const { formSteps, updateStep } = useIssuerSignupContext();

  const form = useForm<IssuerSignupDetailsFormContextType>({
    resolver: joiResolver(IssuerSignupDetailsFormSchema),
    defaultValues: formSteps[FORM_STEP],
    mode: 'onBlur',
  });

  const { handleSubmit } = form;

  const signupDetailsFormSubmitHandler: SubmitHandler<
    IssuerSignupDetailsFormContextType
  > = (data) => {
    updateStep('details', data);
    router.push('/auth/signup/issuer/email');
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-[2.125rem]">
      <header>
        <h1 className="text-xl">{t('header')}</h1>
      </header>
      <article className="flex flex-col gap-5">
        <header className="flex justify-center">
          <IssuerSignupFormStepsTabs currentStep={FORM_STEP} />
        </header>
        <BaseAuthFormCard
          title={t('title')}
          subtitle={t('steps.details.subtitle')}
        >
          <FormProvider {...form}>
            <IssuerSignupDetailsForm
              handleSubmit={handleSubmit(signupDetailsFormSubmitHandler)}
              className="px-[6.5rem]"
            />
          </FormProvider>
        </BaseAuthFormCard>
      </article>
    </main>
  );
};

IssuerSignupDetailsPage.getLayout = (page: ReactElement) => {
  return (
    <IssuerSignupContextProvider>
      <BlankLayout>{page}</BlankLayout>
    </IssuerSignupContextProvider>
  );
};

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale, ['issuer-signup'])),
    },
  };
}) satisfies GetServerSideProps;

export default IssuerSignupDetailsPage;
