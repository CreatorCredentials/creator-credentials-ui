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
  const { t } = useTranslation('common');

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
          {t('resend-email')}
          <Icon
            icon="Refresh"
            className="ms-2"
          />
        </Button>
        <Button
          onClick={goBackHandler}
          disabled={isLoading}
          color="outline"
        >
          <Icon
            icon="ArrowLeft"
            className="me-2"
          />
          <p>{t('go-back')}</p>
        </Button>
      </div>
    </BaseAuthFormCard>
  );
};
