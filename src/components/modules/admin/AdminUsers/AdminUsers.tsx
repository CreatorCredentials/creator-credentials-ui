import { Alert, Button, Spinner, Table, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { ElementType } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { clsxm } from '@/shared/utils/clsxm';
import { formatDate } from '@/shared/utils/formatDate';
import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';
import { Icon } from '@/components/shared/Icon';
import { Loader } from '@/components/shared/Loader';
import { useAdminUsers } from '@/api/queries/useAdminUsers';
import { ClerkRole } from '@/api/requests/getUser';
import { AdminUser } from '@/shared/typings/AdminUser';
import {
  FIRST_PAGE,
  PagedFilters,
  usePagedFilters,
} from '@/shared/hooks/usePagedFilters';
import { AdminPagination } from '../AdminPagination';

const PAGE_SIZE = 20;
const ROLE_FILTERS = [ClerkRole.Issuer, ClerkRole.Creator] as const;
const COLUMN_T_KEYS = [
  'name',
  'email',
  'did',
  'domain',
  'credentials',
  'issued',
  'created-on',
] as const;

type UsersFilters = PagedFilters & { role: ClerkRole };

const INITIAL_FILTERS: UsersFilters = {
  role: ClerkRole.Issuer,
  q: '',
  page: FIRST_PAGE,
};

const displayName = (user: AdminUser) =>
  user.organizationName || user.name || EMPTY_VALUE_PLACEHOLDER;

/** The admin credentials list narrowed to what this user issued or holds. */
const credentialsHrefOf = (user: AdminUser): string => {
  const query = new URLSearchParams(
    user.role === ClerkRole.Issuer
      ? { issuerId: String(user.id) }
      : { q: user.didKey },
  );
  return `/admin/credentials?${query}`;
};

export const AdminUsers = () => {
  const { t } = useTranslation('admin');
  const { filters, debouncedQuery, update, setPage } =
    usePagedFilters<UsersFilters>(INITIAL_FILTERS);

  const { data, isError, isPending, isFetching, isPlaceholderData } =
    useAdminUsers(
      {
        role: filters.role,
        q: debouncedQuery.trim() || undefined,
        page: filters.page,
        pageSize: PAGE_SIZE,
      },
      { placeholderData: keepPreviousData },
    );
  const isRefreshing = isPlaceholderData && isFetching;

  const renderList = () => {
    if (isPending) {
      return <Loader />;
    }
    if (!data?.items.length) {
      return (
        <p
          className="text-xl text-grey-4"
          data-testid="admin-users-empty"
        >
          {t('users.empty')}
        </p>
      );
    }
    return (
      <>
        <Table
          hoverable
          data-testid="admin-users-table"
        >
          <Table.Head>
            {COLUMN_T_KEYS.map((column) => (
              <Table.HeadCell key={column}>
                {t(`users.table.${column}`)}
              </Table.HeadCell>
            ))}
            <Table.HeadCell>
              <span className="sr-only">{t('users.table.actions')}</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data.items.map((user) => (
              <Table.Row
                key={user.id}
                data-testid="admin-user-row"
              >
                <Table.Cell className="font-medium text-black">
                  {displayName(user)}
                </Table.Cell>
                <Table.Cell className="break-all">
                  {user.email || EMPTY_VALUE_PLACEHOLDER}
                </Table.Cell>
                <Table.Cell className="max-w-xs break-all text-xs">
                  {user.didKey}
                </Table.Cell>
                <Table.Cell>
                  {user.domain || user.didWeb || EMPTY_VALUE_PLACEHOLDER}
                </Table.Cell>
                <Table.Cell>{user.counts.credentials}</Table.Cell>
                <Table.Cell>{user.counts.issuedCredentials}</Table.Cell>
                <Table.Cell>
                  <time dateTime={user.createdAt}>
                    {formatDate(user.createdAt)}
                  </time>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    as={Link as ElementType}
                    href={credentialsHrefOf(user)}
                    size="xs"
                    color="outline"
                    data-testid="admin-user-credentials"
                  >
                    {t('users.actions.credentials')}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <AdminPagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      </>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <TextInput
          sizing="lg"
          color="primary"
          icon={() => <Icon icon="Search" />}
          placeholder={t('users.search-placeholder')}
          className="min-w-[25rem]"
          value={filters.q}
          onChange={(event) => update({ q: event.target.value })}
          data-testid="admin-users-search"
        />
        <div className="flex gap-2">
          {ROLE_FILTERS.map((role) => (
            <Button
              key={role}
              pill
              size="xs"
              color={role === filters.role ? 'primary' : 'outline'}
              aria-pressed={role === filters.role}
              data-testid={`admin-users-role-${role}`}
              onClick={() => update({ role })}
            >
              {t(`users.role.${role}`)}
            </Button>
          ))}
        </div>
      </div>
      {isError && (
        <Alert
          color="failure"
          className="mb-4"
          data-testid="admin-users-error-banner"
        >
          {t('users.error')}
        </Alert>
      )}
      <div
        className="relative min-h-[8rem]"
        aria-busy={isRefreshing}
      >
        {isRefreshing && (
          <Spinner
            size="lg"
            className="absolute inset-x-0 top-2 z-10 mx-auto"
          />
        )}
        <div className={clsxm({ 'opacity-50': isRefreshing })}>
          {renderList()}
        </div>
      </div>
    </>
  );
};
