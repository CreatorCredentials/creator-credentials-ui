import { useTranslation } from 'next-i18next';
import { Button } from 'flowbite-react';
import { ElementType } from 'react';
import Link from 'next/link';
import { HomeCard } from '@/components/modules/home/HomeCard';

type VerifyWalletCardProps = {
  className?: string;
};

export const VerifyWalletCard = ({ className }: VerifyWalletCardProps) => {
  const { t } = useTranslation('home-creator');

  return (
    <HomeCard
      title={t('verify-wallet.badge')}
      className={className}
      badge={{
        iconName: 'BadgeCheck',
        color: 'primary',
        label: t('verify-wallet.badge'),
      }}
      renderFooter={({ icon }) => (
        <Button
          color="primary"
          href="/verification"
          as={Link as ElementType}
          className="inline"
        >
          {t('start', { ns: 'common' })}
          {icon}
        </Button>
      )}
    >
      <p className="text-lg text-grey-4">{t('verify-wallet.subtitle')}</p>
    </HomeCard>
  );
};
