import React, { useMemo } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { formatDate } from '@/shared/utils/formatDate';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { CredentialDownloadButton } from '../CredentialDownloadButton';

const issuerNameOf = (
  credential: VerifiedCredentialsUnion,
): string | undefined =>
  'companyName' in credential.data ? credential.data.companyName : undefined;

type RevocationDetailsProps = {
  credential: VerifiedCredentialsUnion;
};

const RevocationDetails = ({ credential }: RevocationDetailsProps) => {
  const { t } = useTranslation('creator-credentials');
  const issuerName = issuerNameOf(credential);

  return (
    <dl
      className="grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-left text-sm text-grey-4"
      data-testid="creator-revoked-details"
    >
      {issuerName && (
        <>
          <dt>{t('revoked.by')}</dt>
          <dd className="text-black">{issuerName}</dd>
        </>
      )}
      {credential.revokedAt && (
        <>
          <dt>{t('revoked.on')}</dt>
          <dd className="text-black">
            <time dateTime={credential.revokedAt}>
              {formatDate(credential.revokedAt)}
            </time>
          </dd>
        </>
      )}
      <dt>{t('revoked.reason')}</dt>
      <dd className="text-black">
        {credential.revokedReason || t('revoked.no-reason')}
      </dd>
    </dl>
  );
};

type CreatorRevokedCredentialsProps = {
  credentials: VerifiedCredentialsUnion[];
};

export const CreatorRevokedCredentials = ({
  credentials,
}: CreatorRevokedCredentialsProps) => {
  const { t } = useTranslation('creator-credentials');
  const revokedCredentials = useMemo(
    () =>
      credentials.filter(
        (credential) =>
          credential.status === CredentialVerificationStatus.Revoked,
      ),
    [credentials],
  );

  return (
    <section
      className="grid grid-cols-3 gap-4"
      data-testid="creator-revoked-section"
    >
      {revokedCredentials.length === 0 && (
        <p className="col-span-3 text-xl text-grey-4">{t('revoked.empty')}</p>
      )}
      {revokedCredentials.map((credential) => (
        <CredentialDetailsCard
          key={credential.id}
          credential={credential}
          dropdownItems={[]}
          testId="creator-revoked-card"
          renderFooter={() => (
            <>
              <ColoredBadge
                badgeType="revoked"
                className="self-center"
              />
              <RevocationDetails credential={credential} />
              <CredentialDownloadButton credential={credential} />
            </>
          )}
        />
      ))}
    </section>
  );
};
