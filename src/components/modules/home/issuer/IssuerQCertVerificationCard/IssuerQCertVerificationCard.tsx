import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from 'flowbite-react';
import { HomeCard } from '../../HomeCard';

export const IssuerQCertVerificationCard = () => {
  const { t } = useTranslation('home-issuer');

  return (
    <HomeCard
      className="flex-1"
      title={t('qualified-certificates.qcert.title')}
      badgeType="verification"
      renderFooter={() => (
        <Button
          color="primary"
          className="inline"
          disabled
        >
          {t('coming-soon', { ns: 'common' })}
        </Button>
      )}
    >
      {t('qualified-certificates.qcert.content')}
    </HomeCard>
  );
};
