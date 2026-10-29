import { ParsedUrlQuery } from 'querystring';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { FIRST_PAGE, PagedFilters } from '@/shared/hooks/usePagedFilters';

export type AdminStatusFilter =
  | CredentialVerificationStatus.Success
  | CredentialVerificationStatus.Pending
  | CredentialVerificationStatus.Revoked;

export const ADMIN_STATUS_FILTERS: AdminStatusFilter[] = [
  CredentialVerificationStatus.Success,
  CredentialVerificationStatus.Pending,
  CredentialVerificationStatus.Revoked,
];

export type AdminCredentialsFilters = PagedFilters & {
  status: AdminStatusFilter;
  type?: CredentialType;
  issuerId?: number;
};

export const DEFAULT_ADMIN_CREDENTIALS_FILTERS: AdminCredentialsFilters = {
  status: CredentialVerificationStatus.Success,
  q: '',
  page: FIRST_PAGE,
};

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const isStatusFilter = (value: unknown): value is AdminStatusFilter =>
  ADMIN_STATUS_FILTERS.includes(value as AdminStatusFilter);

const isCredentialType = (value: unknown): value is CredentialType =>
  Object.values(CredentialType).includes(value as CredentialType);

/** Filters carried in the page URL (links from the users page), ignoring anything malformed. */
export const adminCredentialsFiltersFromQuery = (
  query: ParsedUrlQuery,
): AdminCredentialsFilters => {
  const status = firstValue(query.status);
  const type = firstValue(query.type);
  const issuerId = Number(firstValue(query.issuerId));

  return {
    ...DEFAULT_ADMIN_CREDENTIALS_FILTERS,
    ...(isStatusFilter(status) ? { status } : {}),
    ...(isCredentialType(type) ? { type } : {}),
    ...(Number.isInteger(issuerId) && issuerId > 0 ? { issuerId } : {}),
    q: firstValue(query.q) ?? '',
  };
};
