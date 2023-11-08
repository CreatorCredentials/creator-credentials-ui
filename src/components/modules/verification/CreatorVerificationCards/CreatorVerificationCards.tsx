import React from 'react';
import { useTranslation } from 'next-i18next';
import { useCreatorVerifiedCredentials } from '@/api/queries/useCreatorVerifiedCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { DomainVerificationCard } from '../DomainVerificationCard';
import { EmailVerificationCard } from '../EmailVerificationCard';
import { MetamaskVerificationCard } from '../MetamaskVerificationCard';

export const CreatorVerificationCards = () => {
  const { t } = useTranslation('verification-creator');

  const {
    data: verifiedCredentials,
    isFetching,
    isLoading,
    status,
  } = useCreatorVerifiedCredentials();

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-credentials')} />;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <section className="grid grid-cols-3 gap-4">
      <EmailVerificationCard email={verifiedCredentials.email.data.address} />
      <MetamaskVerificationCard
        walletAddress={verifiedCredentials.metaMask?.data.address}
      />
      <DomainVerificationCard
        value={verifiedCredentials.domain?.data.domain}
        status={verifiedCredentials.domain?.status}
      />
    </section>
  );
};
