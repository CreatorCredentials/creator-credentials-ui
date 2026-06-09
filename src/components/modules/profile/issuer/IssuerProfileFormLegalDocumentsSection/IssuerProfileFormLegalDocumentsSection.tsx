import React from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { config } from '@/shared/constants/config';
import { TermsAndConditionsField } from '../../TermsAndConditionsField';

export const IssuerProfileFormLegalDocumentsSection = () => {
  const { t } = useTranslation('issuer-profile');

  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-xl">{t('legal-documents.title')}</h3>
      <TermsAndConditionsField href={config.ISSUER_TERMS_URL} />
    </section>
  );
};
