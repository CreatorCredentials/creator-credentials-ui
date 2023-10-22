import { Button } from 'flowbite-react';
import { Trans, useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { FormEventHandler } from 'react';
import { FormTextField } from '@/components/formFields/FormTextField';
import { FormCheckbox } from '@/components/formFields/FormCheckbox';
import { CreatorSignupFormContextType } from './CreatorSignupFormContextType';

export type CreatorSignupFormProps = {
  handleSubmit?: FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
};

export const CreatorSignupForm = ({
  handleSubmit,
  isLoading,
}: CreatorSignupFormProps) => {
  const { t } = useTranslation('signup');
  const {
    control,
    watch,
    formState: { isValid },
  } = useFormContext<CreatorSignupFormContextType>();

  const termsAndConditionsValue = watch('termsAndConditions');

  return (
    <form
      className="flex flex-1 flex-col gap-8"
      onSubmit={handleSubmit}
    >
      <FormTextField
        label={t('email', { ns: 'common' })}
        control={control}
        name="email"
        disabled={isLoading}
      />
      <FormCheckbox
        label={
          <Trans
            i18nKey="form.termsAndConditions"
            t={t}
            components={{
              link1: (
                <a
                  className="underline underline-offset-[3px]"
                  href="https://www.google.com"
                  target="_blank"
                />
              ),
            }}
          />
        }
        name="termsAndConditions"
        control={control}
        disabled={isLoading}
        labelProps={{
          className: 'font-medium',
        }}
      />
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={!isValid || !termsAndConditionsValue || isLoading}
          isProcessing={isLoading}
          color="primary"
        >
          <p>{t('send', { ns: 'common' })}</p>
          <HiOutlineArrowRight className="ms-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
