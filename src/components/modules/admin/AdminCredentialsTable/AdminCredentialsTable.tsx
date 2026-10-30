import { Button, Table } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { AdminCredential } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { creatorDisplayName, creatorOf } from '@/shared/utils/credentialsList';
import { formatDate } from '@/shared/utils/formatDate';
import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { BadgeType } from '@/shared/typings/BadgeType';
import { CredentialDownloadButton } from '@/components/modules/credentials/CredentialDownloadButton';

const COLUMN_T_KEYS = [
  'creator',
  'issuer',
  'type',
  'issued-on',
  'status',
] as const;

const STATUS_BADGE: Partial<Record<CredentialVerificationStatus, BadgeType>> = {
  [CredentialVerificationStatus.Success]: 'accepted',
  [CredentialVerificationStatus.Pending]: 'pending',
  [CredentialVerificationStatus.Revoked]: 'revoked',
};

type AdminCredentialsTableProps = {
  credentials: AdminCredential[];
  typeLabelOf: (type: CredentialType) => string;
  onView: (credential: AdminCredential) => void;
  onRevoke: (credential: AdminCredential) => void;
};

export const issuerDisplayName = (
  credential: AdminCredential,
  selfIssuedLabel: string,
): string =>
  credential.issuer
    ? credential.issuer.name || credential.issuer.domain || selfIssuedLabel
    : selfIssuedLabel;

export const AdminCredentialsTable = ({
  credentials,
  typeLabelOf,
  onView,
  onRevoke,
}: AdminCredentialsTableProps) => {
  const { t } = useTranslation('admin');

  return (
    <Table
      hoverable
      data-testid="admin-credentials-table"
    >
      <Table.Head>
        {COLUMN_T_KEYS.map((column) => (
          <Table.HeadCell key={column}>
            {t(`credentials.table.${column}`)}
          </Table.HeadCell>
        ))}
        <Table.HeadCell>
          <span className="sr-only">{t('credentials.table.actions')}</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {credentials.map((credential) => {
          const { email } = creatorOf(credential);
          const badge = credential.status && STATUS_BADGE[credential.status];

          return (
            <Table.Row
              key={credential.id}
              data-testid="admin-row"
            >
              <Table.Cell className="max-w-xs break-words font-medium text-black">
                <div>
                  {creatorDisplayName(credential) || EMPTY_VALUE_PLACEHOLDER}
                </div>
                {email && (
                  <div className="break-words text-xs font-normal text-grey-4">
                    {email}
                  </div>
                )}
              </Table.Cell>
              <Table.Cell className="break-words">
                {issuerDisplayName(credential, t('credentials.self-issued'))}
              </Table.Cell>
              <Table.Cell>{typeLabelOf(credential.type)}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">
                <time dateTime={credential.issuedAt ?? undefined}>
                  {formatDate(credential.issuedAt)}
                </time>
              </Table.Cell>
              <Table.Cell>
                {badge ? (
                  <ColoredBadge badgeType={badge} />
                ) : (
                  EMPTY_VALUE_PLACEHOLDER
                )}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="xs"
                    color="outline"
                    data-testid="admin-view"
                    onClick={() => onView(credential)}
                  >
                    {t('credentials.actions.view')}
                  </Button>
                  {credential.data.credentialObject && (
                    <CredentialDownloadButton
                      credential={credential}
                      size="xs"
                      className="self-auto"
                      testId="admin-download"
                    />
                  )}
                  {credential.status ===
                    CredentialVerificationStatus.Success && (
                    <Button
                      size="xs"
                      color="failure"
                      data-testid="admin-revoke"
                      onClick={() => onRevoke(credential)}
                    >
                      {t('credentials.actions.revoke')}
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
