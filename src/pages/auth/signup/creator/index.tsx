import { joiResolver } from '@hookform/resolvers/joi';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { ReactElement, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useSignupCreator } from '@/api/mutations/useSignupCreator';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import { CreatorSignupCard } from '@/components/modules/creatorSignup/CreatorSignupCard/CreatorSignupCard';
import { CreatorSignupForm } from '@/components/modules/creatorSignup/CreatorSignupForm/CreatorSignupForm';
import { CreatorSignupFormContextType } from '@/components/modules/creatorSignup/CreatorSignupForm/CreatorSignupFormContextType';
import { creatorSignupFormDefaultValues } from '@/components/modules/creatorSignup/CreatorSignupForm/creatorSignupFormDefaultValues';
import { CreatorSignupFormSchema } from '@/components/modules/creatorSignup/CreatorSignupForm/creatorSignupFormSchema';
import { CreatorSIgnupSuccess } from '@/components/modules/creatorSignup/CreatorSignupSuccess/CreatorSIgnupSuccess';
import { useToast } from '@/shared/hooks/useToast';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';

const CreatorSignupPage: NextPageWithLayout = () => {
  const { t } = useTranslation('signup');
  const toast = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<CreatorSignupFormContextType>({
    resolver: joiResolver(CreatorSignupFormSchema),
    defaultValues: creatorSignupFormDefaultValues,
    mode: 'onBlur',
  });

  const {
    mutateAsync,
    reset: resetSignupMutation,
    isLoading,
  } = useSignupCreator();

  const { handleSubmit } = form;

  const signupSubmitHandler: SubmitHandler<
    CreatorSignupFormContextType
  > = async (data) => {
    try {
      await mutateAsync(data);
      setEmailSent(true);
    } catch (error) {
      toast.error(t('error.send-email'));
    }
  };

  const resendVerificationEmailHandler = async () => {
    try {
      await mutateAsync(form.getValues());
    } catch (error) {
      toast.error(t('error.send-email'));
    }
  };

  const resetHandler = () => {
    form.reset();
    resetSignupMutation();
    setEmailSent(false);
  };

  if (emailSent) {
    return (
      <CreatorSIgnupSuccess
        isLoading={isLoading}
        resendVerificationEmailHandler={resendVerificationEmailHandler}
        resetHandler={resetHandler}
      />
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-[2.125rem]">
      <header>
        <h1 className="text-xl">{t('header')}</h1>
      </header>
      <CreatorSignupCard
        title={t('userTypes.creator')}
        description={t('card.description')}
      >
        <FormProvider {...form}>
          <div className="flex-1 px-[6.53rem]">
            <CreatorSignupForm
              handleSubmit={handleSubmit(signupSubmitHandler)}
              isLoading={isLoading}
            />
          </div>
        </FormProvider>
      </CreatorSignupCard>
    </main>
  );
};

CreatorSignupPage.getLayout = (page: ReactElement) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale, ['signup'])),
    },
  };
}) satisfies GetServerSideProps;

export default CreatorSignupPage;
