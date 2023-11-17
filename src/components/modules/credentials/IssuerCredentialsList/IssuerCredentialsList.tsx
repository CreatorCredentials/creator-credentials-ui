import { useTranslation } from 'next-i18next';
import React from 'react';
import { useIssuerCredentials } from '@/api/queries/useIssuerCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { ColoredBadge } from '@/components/shared/ColoredBadge';

export const IssuerCredentialsList = () => {
  const { t } = useTranslation('issuer-credentials');

  const { data, status, isFetching, isLoading } = useIssuerCredentials();

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-credentials')} />;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.credentials.map((credential) => (
        <CredentialDetailsCard
          key={credential.id}
          credential={credential}
          renderFooter={() => (
            <ColoredBadge
              badgeType="active"
              className="self-center"
            />
          )}
        />
      ))}
    </div>
  );
};
