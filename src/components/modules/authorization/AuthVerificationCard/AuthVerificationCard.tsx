import React from 'react';
import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { Icon } from '@/components/shared/Icon';
import { BaseAuthFormCard } from '../BaseAuthFormCard';

type AuthVerificationCardProps = {
  isLoading: boolean;
  title: string;
  subtitle: string;
  goBackHandler: () => void;
  resendVerificationEmailHandler: () => void;
};

export const AuthVerificationCard = ({
  isLoading,
  title,
  subtitle,
  resendVerificationEmailHandler,
  goBackHandler,
}: AuthVerificationCardProps) => {
  const { t } = useTranslation('signup');

  return (
    <BaseAuthFormCard
      title={title}
      subtitle={subtitle}
    >
      <div className="flex flex-col gap-4">
        <Button
          isProcessing={isLoading}
          disabled={isLoading}
          onClick={resendVerificationEmailHandler}
          color="primary"
        >
          {t('verification.resend')}
          <Icon
            icon="Refresh"
            className="ms-2 h-4 w-4"
          />
        </Button>
        <Button
          onClick={goBackHandler}
          disabled={isLoading}
          color="outline"
        >
          <Icon
            icon="ArrowLeft"
            className="me-2 h-4 w-4"
          />
          <p>{t('verification.goBack')}</p>
        </Button>
      </div>
    </BaseAuthFormCard>
  );
};
