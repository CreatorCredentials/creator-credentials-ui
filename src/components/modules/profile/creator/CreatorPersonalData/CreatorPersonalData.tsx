import React, { useId } from 'react';
import { useTranslation } from 'next-i18next';
import { TextInput } from 'flowbite-react';
import { FormLabel } from '@/components/formFields/FormLabel';

type CreatorPersonalDataProps = {
  email: string;
};

export const CreatorPersonalData = ({ email }: CreatorPersonalDataProps) => {
  const { t } = useTranslation('creator-profile');
  const emailId = useId();

  return (
    <article className="flex flex-col gap-6">
      <h2 className="text-xl">{t('personal-data.title')}</h2>
      <div className="flex max-w-[40%] flex-col gap-2">
        <FormLabel htmlFor={emailId}>
          {t('personal-data.fields.e-mail.label')}
        </FormLabel>
        <TextInput
          id={emailId}
          value={email}
          readOnly
        />
      </div>
    </article>
  );
};
