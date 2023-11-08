import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { CardWithBadge } from '@/components/shared/CardWithBadge';

export const DomainVerificationCard = () => {
  const { t } = useTranslation('verification-creator');

  return (
    <CardWithBadge
      badgeType="verification"
      title={t('domain.title')}
      iconName="Public"
      className="flex-1"
      content={<p>{t('domain.description')}</p>}
      footer={
        <Button
          color="primary"
          fullSized
        >
          {t('domain.buttons.start-verification')}
        </Button>
      }
    />
  );
};
