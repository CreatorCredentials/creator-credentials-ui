import React, { useId } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { Checkbox } from 'flowbite-react';
import { FormLabel } from '@/components/formFields/FormLabel';
import { config } from '@/shared/constants/config';

export const CreatorLegalDocuments = () => {
  const { t } = useTranslation('creator-profile');
  const aggreementId = useId();

  return (
    <article className="flex flex-col gap-6">
      <h2 className="text-xl">{t('legal-documents.title')}</h2>
      <div className="flex items-center gap-2">
        <Checkbox
          id={aggreementId}
          checked
          readOnly
          disabled
        />
        <FormLabel htmlFor={aggreementId}>
          <Trans
            i18nKey="legal-documents.fields.terms-and-conditions.label"
            t={t}
            components={{
              link1: (
                <a
                  className="underline underline-offset-[3px]"
                  href={config.TERMS_AND_CONDITIONS_URL}
                  target="_blank"
                />
              ),
            }}
          />
        </FormLabel>
      </div>
    </article>
  );
};
