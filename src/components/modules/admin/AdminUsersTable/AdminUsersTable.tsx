import { Button, Table } from 'flowbite-react';
import Link from 'next/link';
import { ElementType } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { formatDate } from '@/shared/utils/formatDate';
import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';
import { ClerkRole } from '@/api/requests/getUser';
import { AdminUser } from '@/shared/typings/AdminUser';
import { CopyableDid } from '@/components/shared/CopyableDid';

const COLUMN_T_KEYS = [
  'name',
  'did',
  'domain',
  'credentials',
  'issued',
  'created-on',
] as const;

const NUMERIC_CELL = 'whitespace-nowrap text-right tabular-nums';

type AdminUsersTableProps = {
  users: AdminUser[];
};

export const displayName = (user: AdminUser): string =>
  user.organizationName || user.name || EMPTY_VALUE_PLACEHOLDER;

/** The admin credentials list narrowed to what this user issued or holds. */
export const credentialsHrefOf = (user: AdminUser): string => {
  const query = new URLSearchParams(
    user.role === ClerkRole.Issuer
      ? { issuerId: String(user.id) }
      : { q: user.didKey },
  );
  return `/admin/credentials?${query}`;
};

export const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const { t } = useTranslation('admin');

  return (
    <Table
      hoverable
      data-testid="admin-users-table"
    >
      <Table.Head>
        {COLUMN_T_KEYS.map((column) => (
          <Table.HeadCell
            key={column}
            className={
              column === 'credentials' || column === 'issued'
                ? 'text-right'
                : undefined
            }
          >
            {t(`users.table.${column}`)}
          </Table.HeadCell>
        ))}
        <Table.HeadCell>
          <span className="sr-only">{t('users.table.actions')}</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {users.map((user) => (
          <Table.Row
            key={user.id}
            data-testid="admin-user-row"
          >
            <Table.Cell className="max-w-xs">
              <div className="break-words font-medium text-black">
                {displayName(user)}
              </div>
              {user.email && (
                <div className="break-words text-xs text-grey-4">
                  {user.email}
                </div>
              )}
            </Table.Cell>
            <Table.Cell>
              <CopyableDid
                did={user.didKey}
                testId="admin-user-did"
              />
            </Table.Cell>
            <Table.Cell className="break-words">
              {user.domain || user.didWeb || EMPTY_VALUE_PLACEHOLDER}
            </Table.Cell>
            <Table.Cell className={NUMERIC_CELL}>
              {user.counts.credentials}
            </Table.Cell>
            <Table.Cell className={NUMERIC_CELL}>
              {user.counts.issuedCredentials}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap">
              <time dateTime={user.createdAt}>
                {formatDate(user.createdAt)}
              </time>
            </Table.Cell>
            <Table.Cell className="text-right">
              <Button
                as={Link as ElementType}
                href={credentialsHrefOf(user)}
                size="xs"
                color="outline"
                className="inline-flex"
                data-testid="admin-user-credentials"
              >
                {t('users.actions.credentials')}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
