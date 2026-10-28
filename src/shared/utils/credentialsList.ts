import {
  CredentialCreator,
  IssuedCredential,
} from '@/shared/typings/Credentials';

export type CredentialsSort = 'name-asc' | 'name-desc' | 'newest' | 'oldest';

export type CredentialTypeLabelResolver = (
  credential: IssuedCredential,
) => string;

type CredentialComparator = (
  a: IssuedCredential,
  b: IssuedCredential,
) => number;

const UNKNOWN_CREATOR: CredentialCreator = {
  id: 0,
  name: null,
  email: null,
  didKey: '',
};

/** The creator a credential was issued to; a neutral placeholder when the payload has none. */
export const creatorOf = (credential: IssuedCredential): CredentialCreator =>
  credential.creator ?? UNKNOWN_CREATOR;

export const creatorDisplayName = (credential: IssuedCredential): string => {
  const { name, email, didKey } = creatorOf(credential);
  return name || email || didKey;
};

const rawTypeLabel: CredentialTypeLabelResolver = (credential) =>
  credential.type;

const contains = (value: string | null | undefined, needle: string) =>
  Boolean(value) && (value as string).toLowerCase().includes(needle);

export const filterCredentials = (
  credentials: IssuedCredential[],
  query: string,
  typeLabelOf: CredentialTypeLabelResolver = rawTypeLabel,
): IssuedCredential[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return credentials;
  }

  return credentials.filter((credential) => {
    const { name, email, didKey } = creatorOf(credential);
    return (
      contains(name, needle) ||
      contains(email, needle) ||
      contains(didKey, needle) ||
      contains(typeLabelOf(credential), needle)
    );
  });
};

const byName: CredentialComparator = (a, b) =>
  creatorDisplayName(a).localeCompare(creatorDisplayName(b), undefined, {
    sensitivity: 'base',
  });

/** Milliseconds since the epoch; 0 for a missing or invalid timestamp so the comparator never yields NaN. */
const issuedAtMillis = (credential: IssuedCredential): number => {
  const millis = Date.parse(credential.issuedAt ?? '');
  return Number.isNaN(millis) ? 0 : millis;
};

const byIssuedAt: CredentialComparator = (a, b) =>
  issuedAtMillis(a) - issuedAtMillis(b);

const COMPARATORS: Record<CredentialsSort, CredentialComparator> = {
  'name-asc': byName,
  'name-desc': (a, b) => byName(b, a),
  newest: (a, b) => byIssuedAt(b, a),
  oldest: byIssuedAt,
};

export const sortCredentials = (
  credentials: IssuedCredential[],
  sort: CredentialsSort,
): IssuedCredential[] => [...credentials].sort(COMPARATORS[sort]);
