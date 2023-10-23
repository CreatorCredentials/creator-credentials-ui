import React from 'react';
import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { Icon } from '@/components/shared/Icon';
import { CreatorSignupCard } from '../CreatorSignupCard/CreatorSignupCard';

type CreatorSignupSuccessProps = {
  isLoading: boolean;
  resetHandler: () => void;
  resendVerificationEmailHandler: () => void;
};

export const CreatorSIgnupSuccess = ({
  isLoading,
  resendVerificationEmailHandler,
  resetHandler,
}: CreatorSignupSuccessProps) => {
  const { t } = useTranslation('signup');

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <CreatorSignupCard
        title={t('verification.title')}
        description={t('verification.description')}
      >
        <div className="flex flex-col gap-4">
          <Button
            isProcessing={isLoading}
            disabled={isLoading}
            onClick={resendVerificationEmailHandler}
            color="primary"
          >
            {t('verification.resend')}
          </Button>
          <Button
            onClick={resetHandler}
            disabled={isLoading}
            color="outline"
          >
            <Icon
              icon="ArrowLeft"
              className="me-2 h-5 w-5"
            />
            <p>{t('verification.goBack')}</p>
          </Button>
        </div>
      </CreatorSignupCard>
    </main>
  );
};
