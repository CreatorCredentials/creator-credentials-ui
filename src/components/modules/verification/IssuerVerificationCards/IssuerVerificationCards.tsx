import React from 'react';
import { useTranslation } from 'next-i18next';
import { useIssuerCredentials } from '@/api/queries/useIssuerCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { UserRole } from '@/shared/typings/UserRole';
import { DomainVerificationCard } from '../DomainVerificationCard';
import { DidWebVerificationCard } from '../did-web/DidWebVerificationCard';

export const IssuerVerificationCards = () => {
  const { t } = useTranslation('verification-cards');

  const { data, isFetching, isLoading, status } = useIssuerCredentials({
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
      <DomainVerificationCard
        value={data.credentials.domain?.data.domain}
        status={data.credentials.domain?.status}
        dropdownItems={[]}
        userRole={UserRole.Issuer}
      />
      <DidWebVerificationCard
        value={data.credentials.didWeb?.data.domain}
        status={data.credentials.didWeb?.status}
        dropdownItems={[]}
        userRole={UserRole.Issuer}
      />
    </section>
  );
};
