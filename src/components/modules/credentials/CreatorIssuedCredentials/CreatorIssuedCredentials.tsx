import React, { useMemo } from 'react';
import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { Icon } from '@/components/shared/Icon';

type CreatorIssuedCredentialsProps = {
  credentials: VerifiedCredentialsUnion[];
};

export const CreatorIssuedCredentials = ({
  credentials,
}: CreatorIssuedCredentialsProps) => {
  const { t } = useTranslation('cards');

  const issuedCredentials = useMemo(
    () =>
      credentials.filter(
        (credential) =>
          credential.status &&
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
          renderFooter={() => (
            <Button
              color="outline"
              className="self-stretch"
            >
              {t('download', { ns: 'common' })}
              <Icon
                icon="Download"
                className="ms-2"
              />
            </Button>
          )}
        />
      ))}
    </section>
  );
};
