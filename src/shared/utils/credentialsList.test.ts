import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CreatorConnectionStatus } from '@/shared/typings/CreatorConnectionStatus';
import {
  CredentialCreator,
  IssuedCredential,
} from '@/shared/typings/Credentials';
import {
  creatorDisplayName,
  filterCredentials,
  sortCredentials,
} from './credentialsList';

type IssuedMembershipLike = Extract<
  IssuedCredential,
  { type: CredentialType.Member | CredentialType.DataSupplier }
>;

type IssuedCredentialOverrides = Partial<
  Omit<IssuedMembershipLike, 'type' | 'creator'>
> & {
  type?: IssuedMembershipLike['type'];
  creator?: Partial<CredentialCreator> | null;
};

const issuedCredential = ({
  type = CredentialType.Member,
  creator,
  ...overrides
}: IssuedCredentialOverrides = {}): IssuedCredential => ({
  id: '1',
  status: CredentialVerificationStatus.Success,
  type,
  data: { companyName: 'Acme' },
  issuedAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T10:00:00.000Z',
  connectionStatus: CreatorConnectionStatus.Accepted,
  ...overrides,
  creator:
    creator === null
      ? null
      : {
          id: 7,
          name: 'Alice Example',
          email: 'alice@example.org',
          didKey: 'did:key:zAlice',
          ...creator,
        },
});

const alice = issuedCredential({ id: 'alice' });
const bob = issuedCredential({
  id: 'bob',
  type: CredentialType.DataSupplier,
  issuedAt: '2026-10-05T10:00:00.000Z',
  creator: {
    name: 'bob builder',
    email: 'bob@builders.io',
    didKey: 'did:key:zBob',
  },
});
const carol = issuedCredential({
  id: 'carol',
  issuedAt: '2026-08-20T10:00:00.000Z',
  creator: {
    name: 'Carol',
    email: 'carol@example.org',
    didKey: 'did:key:zCarol',
  },
});
const list = [alice, bob, carol];
const ids = (credentials: IssuedCredential[]) => credentials.map((c) => c.id);

describe('filterCredentials', () => {
  it('returns the list unchanged for an empty or blank query', () => {
    expect(filterCredentials(list, '')).toBe(list);
    expect(filterCredentials(list, '   ')).toBe(list);
  });

  it('matches the creator name case-insensitively and trims the query', () => {
    expect(ids(filterCredentials(list, '  ALICE '))).toEqual(['alice']);
  });

  it('matches a fragment of the e-mail', () => {
    expect(ids(filterCredentials(list, 'builders.io'))).toEqual(['bob']);
  });

  it('matches a fragment of the did:key', () => {
    expect(ids(filterCredentials(list, 'zcarol'))).toEqual(['carol']);
  });

  it('matches the raw credential type when no label resolver is given', () => {
    expect(ids(filterCredentials(list, 'datasupplier'))).toEqual(['bob']);
  });

  it('matches the resolved credential type label', () => {
    const labels: Partial<Record<CredentialType, string>> = {
      [CredentialType.Member]: 'Member',
      [CredentialType.DataSupplier]: 'Open Future Data Supplier',
    };
    const result = filterCredentials(
      list,
      'member',
      (credential) => labels[credential.type] ?? credential.type,
    );

    expect(ids(result)).toEqual(['alice', 'carol']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterCredentials(list, 'nobody')).toEqual([]);
  });

  it('never throws for a credential without a creator', () => {
    const orphan = issuedCredential({ id: 'orphan', creator: null });

    expect(
      filterCredentials([orphan, alice], 'alice').map((c) => c.id),
    ).toEqual(['alice']);
    expect(filterCredentials([orphan], 'member')).toEqual([orphan]);
  });

  it('ignores a missing name and e-mail', () => {
    const anonymous = issuedCredential({
      id: 'anon',
      creator: { name: null, email: null, didKey: 'did:key:zAnon' },
    });

    expect(ids(filterCredentials([anonymous], 'zanon'))).toEqual(['anon']);
    expect(filterCredentials([anonymous], 'alice')).toEqual([]);
  });
});

describe('sortCredentials', () => {
  it('sorts by creator name A to Z ignoring case', () => {
    expect(ids(sortCredentials(list, 'name-asc'))).toEqual([
      'alice',
      'bob',
      'carol',
    ]);
  });

  it('sorts by creator name Z to A', () => {
    expect(ids(sortCredentials(list, 'name-desc'))).toEqual([
      'carol',
      'bob',
      'alice',
    ]);
  });

  it('sorts newest first by issuedAt', () => {
    expect(ids(sortCredentials(list, 'newest'))).toEqual([
      'bob',
      'alice',
      'carol',
    ]);
  });

  it('sorts oldest first by issuedAt', () => {
    expect(ids(sortCredentials(list, 'oldest'))).toEqual([
      'carol',
      'alice',
      'bob',
    ]);
  });

  it('treats a missing or invalid issuedAt as the oldest and never yields NaN', () => {
    const undated = issuedCredential({ id: 'undated', issuedAt: null });
    const garbled = issuedCredential({ id: 'garbled', issuedAt: 'garbled' });

    expect(ids(sortCredentials([undated, alice, garbled], 'newest'))).toEqual([
      'alice',
      'undated',
      'garbled',
    ]);
    expect(ids(sortCredentials([alice, undated, garbled], 'oldest'))).toEqual([
      'undated',
      'garbled',
      'alice',
    ]);
  });

  it('sorts credentials without a creator by an empty name', () => {
    const orphan = issuedCredential({ id: 'orphan', creator: null });

    expect(ids(sortCredentials([alice, orphan], 'name-asc'))).toEqual([
      'orphan',
      'alice',
    ]);
  });

  it('does not mutate the input list', () => {
    const input = [...list];
    sortCredentials(input, 'name-desc');

    expect(ids(input)).toEqual(['alice', 'bob', 'carol']);
  });
});

describe('creatorDisplayName', () => {
  it('prefers the name, then the e-mail, then the did:key', () => {
    expect(creatorDisplayName(alice)).toBe('Alice Example');
    expect(
      creatorDisplayName(issuedCredential({ creator: { name: null } })),
    ).toBe('alice@example.org');
    expect(
      creatorDisplayName(
        issuedCredential({ creator: { name: null, email: null } }),
      ),
    ).toBe('did:key:zAlice');
  });

  it('is empty for a credential without a creator or did:key', () => {
    expect(creatorDisplayName(issuedCredential({ creator: null }))).toBe('');
    expect(
      creatorDisplayName(
        issuedCredential({ creator: { name: null, email: null, didKey: '' } }),
      ),
    ).toBe('');
  });
});
