import { useMemo } from 'react';
import { GetAdminCredentialsSearchParams } from '@/api/requests/getAdminCredentials';
import { usePagedFilters } from '@/shared/hooks/usePagedFilters';
import {
  AdminCredentialsFilters,
  DEFAULT_ADMIN_CREDENTIALS_FILTERS,
} from './adminCredentialsFilters';

export const ADMIN_CREDENTIALS_PAGE_SIZE = 20;

/** Filter state of `/admin/credentials` and the query parameters it maps to. */
export const useAdminCredentialsFilters = (
  initial: AdminCredentialsFilters = DEFAULT_ADMIN_CREDENTIALS_FILTERS,
) => {
  const { filters, debouncedQuery, update, setPage } =
    usePagedFilters<AdminCredentialsFilters>(initial);

  const params = useMemo<GetAdminCredentialsSearchParams>(() => {
    const q = debouncedQuery.trim();
    return {
      status: filters.status,
      type: filters.type,
      issuerId: filters.issuerId,
      q: q || undefined,
      page: filters.page,
      pageSize: ADMIN_CREDENTIALS_PAGE_SIZE,
    };
  }, [filters, debouncedQuery]);

  return { filters, params, update, setPage };
};
