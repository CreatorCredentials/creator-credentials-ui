import { Table } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { IssuedCredential } from '@/shared/typings/Credentials';
import { CredentialAction } from '@/shared/typings/CredentialAction';
import { CreatorConnectionStatus } from '@/shared/typings/CreatorConnectionStatus';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import {
  creatorDisplayName,
  creatorOf,
  CredentialTypeLabelResolver,
} from '@/shared/utils/credentialsList';
import { formatDate } from '@/shared/utils/formatDate';
import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';
import { ActionsMenu } from '@/components/shared/ActionsMenu';
import { ConnectionRevokedMarker } from '../ConnectionRevokedMarker';
import { IssuedCredentialStatus } from '../IssuedCredentialStatus';

const COLUMN_T_KEYS = [
  'creator',
  'email',
  'type',
  'issued-on',
  'status',
] as const;

type IssuedCredentialsTableProps = {
  credentials: IssuedCredential[];
  actionsFor: (credential: IssuedCredential) => CredentialAction[];
  typeLabelOf: CredentialTypeLabelResolver;
};

export const IssuedCredentialsTable = ({
  credentials,
  actionsFor,
  typeLabelOf,
}: IssuedCredentialsTableProps) => {
  const { t } = useTranslation('issuer-credentials');
  const { copy } = useCopyToClipboard();

  return (
    <Table hoverable>
      <Table.Head>
        {COLUMN_T_KEYS.map((column) => (
          <Table.HeadCell key={column}>
            {t(`issued.table.${column}`)}
          </Table.HeadCell>
        ))}
        <Table.HeadCell>
          <span className="sr-only">{t('issued.table.actions')}</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {credentials.map((credential) => {
          const { email } = creatorOf(credential);

          return (
            <Table.Row
              key={credential.id}
              data-testid="credential-row"
            >
              <Table.Cell className="min-w-[10rem] break-words font-medium text-black">
                {creatorDisplayName(credential) || EMPTY_VALUE_PLACEHOLDER}
              </Table.Cell>
              <Table.Cell className="max-w-xs">
                {email ? (
                  <button
                    className="break-words text-left"
                    onClick={() => copy(email)}
                    data-testid="credential-email"
                  >
                    {email}
                  </button>
                ) : (
                  EMPTY_VALUE_PLACEHOLDER
                )}
              </Table.Cell>
              <Table.Cell>{typeLabelOf(credential)}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">
                <time dateTime={credential.issuedAt ?? undefined}>
                  {formatDate(credential.issuedAt)}
                </time>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-col items-start gap-1">
                  <IssuedCredentialStatus credential={credential} />
                  {credential.connectionStatus ===
                    CreatorConnectionStatus.Revoked && (
                    <ConnectionRevokedMarker />
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>
                <ActionsMenu
                  items={actionsFor(credential)}
                  testId="credential-menu"
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
