import { useCallback, useState } from 'react';
import { useDebouncedValue } from '../useDebouncedValue';

export const FIRST_PAGE = 1;
export const SEARCH_DEBOUNCE_MS = 300;

export type PagedFilters = {
  q: string;
  page: number;
};

/**
 * Filter state of a server-side paged list: any filter change goes back to
 * the first page and the search text is debounced before it reaches the API.
 */
export const usePagedFilters = <F extends PagedFilters>(initial: F) => {
  const [filters, setFilters] = useState<F>(initial);
  const debouncedQuery = useDebouncedValue(filters.q, SEARCH_DEBOUNCE_MS);

  const update = useCallback(
    (patch: Partial<Omit<F, 'page'>>) =>
      setFilters((previous) => ({ ...previous, ...patch, page: FIRST_PAGE })),
    [],
  );

  const setPage = useCallback(
    (page: number) => setFilters((previous) => ({ ...previous, page })),
    [],
  );

  return { filters, debouncedQuery, update, setPage };
};
