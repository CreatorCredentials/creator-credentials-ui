import React, { useMemo } from 'react';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { CredentialDownloadButton } from '../CredentialDownloadButton';

type CreatorIssuedCredentialsProps = {
  credentials: VerifiedCredentialsUnion[];
};

export const CreatorIssuedCredentials = ({
  credentials,
}: CreatorIssuedCredentialsProps) => {
  const issuedCredentials = useMemo(
    () =>
      credentials.filter(
        (credential) =>
          credential.status === CredentialVerificationStatus.Success,
      ),
    [credentials],
  );

  return (
    <section className="grid grid-cols-3 gap-4">
      {issuedCredentials.map((credential) => (
        <CredentialDetailsCard
          key={credential.id}
          credential={credential}
          dropdownItems={[]}
          testId={
            credential.type === CredentialType.Creator
              ? 'verified-creator-card'
              : undefined
          }
          renderFooter={() => (
            <CredentialDownloadButton credential={credential} />
          )}
        />
      ))}
    </section>
  );
};
