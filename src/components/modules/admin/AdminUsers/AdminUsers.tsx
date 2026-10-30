import { Alert, Button, Spinner, TextInput } from 'flowbite-react';
import { keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { clsxm } from '@/shared/utils/clsxm';
import { Icon } from '@/components/shared/Icon';
import { Loader } from '@/components/shared/Loader';
import { useAdminUsers } from '@/api/queries/useAdminUsers';
import { ClerkRole } from '@/api/requests/getUser';
import {
  FIRST_PAGE,
  PagedFilters,
  usePagedFilters,
} from '@/shared/hooks/usePagedFilters';
import { AdminPagination } from '../AdminPagination';
import { AdminUsersTable } from '../AdminUsersTable';

const PAGE_SIZE = 20;
const ROLE_FILTERS = [ClerkRole.Issuer, ClerkRole.Creator] as const;

type UsersFilters = PagedFilters & { role: ClerkRole };

const INITIAL_FILTERS: UsersFilters = {
  role: ClerkRole.Issuer,
  q: '',
  page: FIRST_PAGE,
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
        <AdminUsersTable users={data.items} />
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
