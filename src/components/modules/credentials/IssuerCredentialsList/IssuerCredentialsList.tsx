import React, { useMemo } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useIssuerCredentials } from '@/api/queries/useIssuerCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { ColoredBadge } from '@/components/shared/ColoredBadge';

export const IssuerCredentialsList = () => {
  const { t } = useTranslation('issuer-credentials');

  const { data, status, isFetching, isLoading } = useIssuerCredentials();

  // const credentials: EmailCredential[] = data;
  const confirmedCredentials = useMemo(
    () =>
      // Object.values(data?.credentials || [])
      //   .flat()
      //   .filter(
      //     (credential) =>
      //       credential.status === CredentialVerificationStatus.Success,
      //   ),
      data?.email ? [data?.email] : [],
    [data],
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
          dropdownItems={[]}
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
