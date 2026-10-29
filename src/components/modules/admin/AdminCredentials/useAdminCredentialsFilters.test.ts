import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { SEARCH_DEBOUNCE_MS } from '@/shared/hooks/usePagedFilters';
import {
  ADMIN_CREDENTIALS_PAGE_SIZE,
  useAdminCredentialsFilters,
} from './useAdminCredentialsFilters';
import {
  adminCredentialsFiltersFromQuery,
  DEFAULT_ADMIN_CREDENTIALS_FILTERS,
} from './adminCredentialsFilters';

describe('useAdminCredentialsFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts on the first page of issued credentials without a search', () => {
    const { result } = renderHook(() => useAdminCredentialsFilters());

    expect(result.current.params).toEqual({
      status: CredentialVerificationStatus.Success,
      type: undefined,
      issuerId: undefined,
      q: undefined,
      page: 1,
      pageSize: ADMIN_CREDENTIALS_PAGE_SIZE,
    });
  });

  it('changing a filter resets the page to the first one', () => {
    const { result } = renderHook(() => useAdminCredentialsFilters());

    act(() => result.current.setPage(3));
    expect(result.current.params.page).toBe(3);

    act(() =>
      result.current.update({ status: CredentialVerificationStatus.Revoked }),
    );
    expect(result.current.params).toMatchObject({
      status: CredentialVerificationStatus.Revoked,
      page: 1,
    });

    act(() => result.current.setPage(2));
    act(() => result.current.update({ type: CredentialType.Member }));
    expect(result.current.params).toMatchObject({
      type: CredentialType.Member,
      page: 1,
    });
  });

  it('debounces the search text before it reaches the query parameters', () => {
    const { result } = renderHook(() => useAdminCredentialsFilters());

    act(() => result.current.update({ q: 'ali' }));
    act(() => result.current.update({ q: 'alice' }));
    expect(result.current.filters.q).toBe('alice');
    expect(result.current.params.q).toBeUndefined();

    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1));
    expect(result.current.params.q).toBeUndefined();

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.params.q).toBe('alice');
  });

  it('sends a blank search as no search at all', () => {
    const { result } = renderHook(() => useAdminCredentialsFilters());

    act(() => result.current.update({ q: '   ' }));
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));

    expect(result.current.params.q).toBeUndefined();
  });

  it('clearing a select sends the filter as undefined', () => {
    const { result } = renderHook(() =>
      useAdminCredentialsFilters({
        ...DEFAULT_ADMIN_CREDENTIALS_FILTERS,
        issuerId: 5,
      }),
    );
    expect(result.current.params.issuerId).toBe(5);

    act(() => result.current.update({ issuerId: undefined }));
    expect(result.current.params.issuerId).toBeUndefined();
  });
});

describe('adminCredentialsFiltersFromQuery', () => {
  it('reads the issuer, the status and the search from the URL', () => {
    expect(
      adminCredentialsFiltersFromQuery({
        issuerId: '12',
        status: 'REVOKED',
        q: 'did:key:z',
      }),
    ).toEqual({
      status: CredentialVerificationStatus.Revoked,
      issuerId: 12,
      q: 'did:key:z',
      page: 1,
    });
  });

  it('falls back to the defaults for malformed values', () => {
    expect(
      adminCredentialsFiltersFromQuery({
        issuerId: 'abc',
        status: 'FAILED',
        type: 'NOPE',
      }),
    ).toEqual(DEFAULT_ADMIN_CREDENTIALS_FILTERS);
  });
});
