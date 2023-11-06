import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import React, { ElementType } from 'react';
import Link from 'next/link';
import { CardWithTitle } from '@/components/shared/CardWithTitle';

export const DomainVerificationVerificationCard = () => {
  const { t } = useTranslation('domain-verification');

  return (
    <CardWithTitle
      title={t('cards.dns-record-verification.title')}
      description={t('cards.dns-record-verification.description')}
    >
      <Button
        color="primary"
        className="self-start"
        href="/creator/verification"
        as={Link as ElementType}
      >
        {t('cards.dns-record-verification.button')}
      </Button>
    </CardWithTitle>
  );
};
