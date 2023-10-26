import { CustomFlowbiteTheme } from 'flowbite-react';
import { Trans, useTranslation } from 'next-i18next';
import { FormEventHandler, ReactNode } from 'react';
import { FormState, useFormContext } from 'react-hook-form';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { FormTextField } from '@/components/formFields/FormTextField';
import { FormCheckbox } from '@/components/formFields/FormCheckbox';
import { IssuerSignupEmailFormContextType } from './IssuerSignupEmailForm.types';

const emailWithDomainInputTheme: CustomFlowbiteTheme['textInput'] = {
  field: {
    base: 'w-full flex flex-row-reverse items-center',
    rightIcon: {
      base: 'pointer-events-none static inset-y-0 left-0 flex items-center text-md',
      svg: '',
    },
    input: {
      withRightIcon: {
        on: '',
      },
    },
  },
};

export type IssuerSignupEmailFormProps = {
  isLoading?: boolean;
  className?: string | ClassValue;
  emailInputDomain: string;
  handleSubmit?: FormEventHandler<HTMLFormElement>;
  renderButtons?: (
    formState: FormState<IssuerSignupEmailFormContextType>,
  ) => ReactNode;
};

export const IssuerSignupEmailForm = ({
  isLoading,
  className,
  emailInputDomain,
  handleSubmit,
  renderButtons,
}: IssuerSignupEmailFormProps) => {
  const { t } = useTranslation('issuer-signup');

  const { control, formState } =
    useFormContext<IssuerSignupEmailFormContextType>();

  return (
    <form
      className={clsxm('flex flex-col items-center gap-14', className)}
      onSubmit={handleSubmit}
    >
      <div className="mt-[0.0625rem] flex flex-col gap-7">
        <FormTextField
          label={t('form-fields.address.label')}
          control={control}
          name="address"
          disabled={isLoading}
          inputProps={{
            placeholder: t('form-fields.address.placeholder'),
            theme: emailWithDomainInputTheme,
            rightIcon: () => <span>@{emailInputDomain}</span>,
          }}
        />
        <FormCheckbox
          label={
            <Trans
              i18nKey="form-fields.terms-and-conditions.label"
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
            className: 'text-base',
          }}
        />
      </div>
      {renderButtons && renderButtons(formState)}
    </form>
  );
};
