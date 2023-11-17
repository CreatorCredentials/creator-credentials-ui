import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import { useIssuerCredentials } from '@/api/queries/useIssuerCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';

export const IssuerCredentialsList = () => {
  const { t } = useTranslation('issuer-credentials');

  const { data, status, isFetching, isLoading } = useIssuerCredentials();

  const confirmedCredentials = useMemo(
    () =>
      Object.values(data?.credentials || [])
        .flat()
        .filter(
          (credential) =>
            credential.status === CredentialVerificationStatus.Success,
        ),
    [data?.credentials],
  );

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-credentials')} />;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {confirmedCredentials.map((credential) => (
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
