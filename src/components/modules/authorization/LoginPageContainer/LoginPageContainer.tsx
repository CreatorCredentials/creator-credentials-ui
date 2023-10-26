import { joiResolver } from '@hookform/resolvers/joi';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useLogIn } from '@/api/mutations/useLogIn';
import { BaseAuthFormCard } from '@/components/modules/authorization/BaseAuthFormCard';
import { LoginForm } from '@/components/modules/authorization/LoginForm';
import { loginFormDefaultValues } from '@/components/modules/authorization/LoginForm/LoginForm.constants';
import { LoginFormSchema } from '@/components/modules/authorization/LoginForm/LoginForm.schema';
import { LoginFormContextType } from '@/components/modules/authorization/LoginForm/LoginForm.types';
import { useToast } from '@/shared/hooks/useToast';
import { UserRole } from '@/shared/typings/UserRole';
import { AuthVerificationCard } from '../AuthVerificationCard/AuthVerificationCard';

type LoginPageContainerProps = {
  userRole: UserRole;
};

export const LoginPageContainer = ({ userRole }: LoginPageContainerProps) => {
  const { t } = useTranslation('login');
  const toast = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<LoginFormContextType>({
    resolver: joiResolver(LoginFormSchema),
    defaultValues: loginFormDefaultValues,
    mode: 'onBlur',
  });

  const { mutateAsync, reset: resetSignupMutation, isLoading } = useLogIn();

  const { handleSubmit } = form;

  const signupSubmitHandler: SubmitHandler<LoginFormContextType> = async (
    data,
  ) => {
    try {
      await mutateAsync({ ...data, userRole });
      setEmailSent(true);
    } catch (error) {
      toast.error(t('error.send-email'));
    }
  };

  const resendVerificationEmailHandler = async () => {
    try {
      await mutateAsync({ ...form.getValues(), userRole });
    } catch (error) {
      toast.error(t('error.send-email'));
    }
  };

  const goBackHandler = () => {
    resetSignupMutation();
    setEmailSent(false);
  };

  if (emailSent) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center">
        <AuthVerificationCard
          title="Verification"
          subtitle="We have sent you an email with a link to verify your account. Please check your inbox and click on the link to verify your account."
          isLoading={isLoading}
          resendVerificationEmailHandler={resendVerificationEmailHandler}
          goBackHandler={goBackHandler}
        />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <BaseAuthFormCard
        title={t(`userTypes.${userRole.toLowerCase()}`)}
        subtitle={t('card.description')}
      >
        <FormProvider {...form}>
          <div className="flex-1 px-[6.75rem]">
            <LoginForm
              handleSubmit={handleSubmit(signupSubmitHandler)}
              isLoading={isLoading}
            />
          </div>
        </FormProvider>
      </BaseAuthFormCard>
    </main>
  );
};
