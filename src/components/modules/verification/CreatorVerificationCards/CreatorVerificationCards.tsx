import React from 'react';
import { useTranslation } from 'next-i18next';
import { useCreatorCredentials } from '@/api/queries/useCreatorCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { UserRole } from '@/shared/typings/UserRole';
import { DomainVerificationCard } from '../DomainVerificationCard';
import { EmailVerificationCard } from '../EmailVerificationCard';
import { MetamaskVerificationCard } from '../MetamaskVerificationCard';

export const CreatorVerificationCards = () => {
  const { t } = useTranslation('creator-verification');

  const {
    data: verifiedCredentials,
    isFetching,
    isLoading,
    status,
  } = useCreatorCredentials({
    staleTime: 1000 * 60 * 1, // 1 minute
  });

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
        userRole={UserRole.Creator}
      />
    </section>
  );
};
