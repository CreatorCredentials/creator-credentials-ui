import React from 'react';
import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { Icon } from '@/components/shared/Icon';
import { UserRole } from '@/shared/typings/UserRole';
import { TemporaryLogInButton } from '@/components/shared/TemporaryLogInButton';
import { BaseAuthFormCard } from '../BaseAuthFormCard';

type AuthVerificationCardProps = {
  isLoading: boolean;
  title: string;
  subtitle: string;
  userRole: UserRole;
  goBackHandler: () => void;
  resendVerificationEmailHandler: () => void;
};

export const AuthVerificationCard = ({
  isLoading,
  title,
  subtitle,
  userRole,
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
        <TemporaryLogInButton userRole={userRole} />
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
