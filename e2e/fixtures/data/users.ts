import { ClerkRole, User } from '@/api/requests/getUser';
import { Creator } from '@/shared/typings/Creator';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
import { CredentialCreator } from '@/shared/typings/Credentials';
import { IssuerProfile } from '@/shared/typings/IssuerProfile';
import { Role } from '../env';

export const ISSUER_NAME = 'Acme Publishing';
export const ISSUER_DOMAIN = 'acme-publishing.test';
export const PLATFORM_HOST = 'liccium.com';

const CREATED_AT = new Date('2026-01-10T09:00:00.000Z');

/** The creator the signed-in creator test user represents in the fixtures. */
export const CREATOR_ALICE: CredentialCreator = {
  id: 7,
  name: 'Alice Example',
  email: 'alice@example.org',
  didKey: 'did:key:zDnaeAliceQm4pXkU6utX9VEBcVTZNKmBz94tTdayKafvN7ax',
};

export const CREATOR_BOB: CredentialCreator = {
  id: 8,
  name: 'Bob Builder',
  email: 'bob@builders.test',
  didKey: 'did:key:zDnaeBobR2fJ7h3tTdayKafvN7ax6XkU6utX9VEBcVTZNKmB',
};

/** No display name: the UI falls back to the e-mail. Connection revoked by the issuer. */
export const CREATOR_CAROL: CredentialCreator = {
  id: 9,
  name: null,
  email: 'carol@dataworks.test',
  didKey: 'did:key:zDnaeCarolV7ax6XkU6utX9VEBcVTZNKmBz94tTdayKafvN',
};

export const CREATOR_ERIN: CredentialCreator = {
  id: 11,
  name: 'Erin Pending',
  email: 'erin@pending.test',
  didKey: 'did:key:zDnaeErinKafvN7ax6XkU6utX9VEBcVTZNKmBz94tTday',
};

export const ISSUER_ID = 1;
export const ADMIN_ID = 99;
export const ADMIN_NAME = 'Platform Admin';

const CLERK_ROLE: Record<Role, ClerkRole> = {
  issuer: ClerkRole.Issuer,
  creator: ClerkRole.Creator,
  admin: ClerkRole.Admin,
};

const USER_ID: Record<Role, number> = {
  issuer: ISSUER_ID,
  creator: CREATOR_ALICE.id,
  admin: ADMIN_ID,
};

const baseUser = (role: Role): User => ({
  id: USER_ID[role],
  clerkId: `user_e2e_${role}`,
  clerkRole: CLERK_ROLE[role],
  credentials: [],
  publicAddress: '',
  createdAt: CREATED_AT,
  updatedAt: CREATED_AT,
  domainPendingVerifcation: false,
  domainRecord: '',
  domain: role === 'issuer' ? ISSUER_DOMAIN : '',
  domainRecordChangedAt: CREATED_AT,
  externalDidKey: null,
  externalPublicKeyPem: null,
  activeDidKeySource: 'platform',
  externalCertPem: role === 'issuer' ? '-----BEGIN CERTIFICATE-----' : null,
  activeSigningCertSource: role === 'issuer' ? 'external' : 'platform',
  credentialsToIssue: role === 'issuer' ? ['MEMBER'] : [],
  organizationName: role === 'issuer' ? ISSUER_NAME : null,
  description: '',
});

export const userFor = (role: Role): User => baseUser(role);

export const profileFor = (role: Role): IssuerProfile => ({
  domain: role === 'issuer' ? ISSUER_DOMAIN : '',
  companyName: role === 'issuer' ? ISSUER_NAME : '',
  email:
    role === 'issuer' ? `issuer@${ISSUER_DOMAIN}` : (CREATOR_ALICE.email ?? ''),
  description: '',
});

const creatorListEntry = (
  creator: CredentialCreator,
  status: CreatorVerificationStatus,
): Creator => ({
  id: String(creator.id),
  imageUrl: '',
  title: creator.name ?? creator.email ?? creator.didKey,
  credentials: { email: creator.email ?? '' },
  status,
});

/** Creators as the issuer sees them on `/v1/users/creators`. */
export const ISSUER_CREATORS: Creator[] = [
  creatorListEntry(CREATOR_ALICE, CreatorVerificationStatus.Accepted),
  creatorListEntry(CREATOR_BOB, CreatorVerificationStatus.Accepted),
  creatorListEntry(CREATOR_ERIN, CreatorVerificationStatus.Pending),
];
