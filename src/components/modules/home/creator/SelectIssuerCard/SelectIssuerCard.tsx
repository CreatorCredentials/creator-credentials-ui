import { useTranslation } from 'next-i18next';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { ElementType } from 'react';
import { HomeCard } from '@/components/modules/home/HomeCard';

export const SelectIssuerCard = () => {
  const { t } = useTranslation('home-creator');

  return (
    <HomeCard
      title={t('select-issuer.title')}
      badge={{
        iconName: 'Building',
        label: t('select-issuer.badge'),
      }}
      renderFooter={({ icon }) => (
        <Button
          color="primary"
          href="/issuers"
          as={Link as ElementType}
          className="inline"
        >
          {t('select', { ns: 'common' })}
          {icon}
        </Button>
      )}
    >
      <p className="text-lg text-grey-4">{t('select-issuer.subtitle')}</p>
    </HomeCard>
  );
};
