import { useTranslation } from '@/shared/utils/useTranslation';
import { config } from '@/shared/constants/config';
import { TermsAndConditionsField } from '../../TermsAndConditionsField';

export const CreatorLegalDocuments = () => {
  const { t } = useTranslation('creator-profile');

  return (
    <article className="flex flex-col gap-6">
      <h2 className="text-xl">{t('legal-documents.title')}</h2>
      <TermsAndConditionsField href={config.CREATOR_TERMS_URL} />
    </article>
  );
};
