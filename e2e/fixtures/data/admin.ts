import { ClerkRole } from '@/api/requests/getUser';
import { AdminStats } from '@/shared/typings/AdminStats';
import { AdminUser } from '@/shared/typings/AdminUser';
import {
  AdminCredential,
  CredentialCreator,
  CredentialIssuer,
  CredentialRevoker,
} from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import {
  ISSUED_RECORDS,
  IssuedRecord,
  membershipRecord,
  PENDING_REQUEST,
} from './credentials';
import {
  ADMIN_ID,
  ADMIN_NAME,
  CREATOR_ALICE,
  CREATOR_BOB,
  CREATOR_CAROL,
  ISSUER_DOMAIN,
  ISSUER_ID,
  ISSUER_NAME,
} from './users';

export const STATUS_LIST_CREDENTIAL_URL =
  'https://api.liccium.test/v1/status-lists/1';

export const ACME_ISSUER: CredentialIssuer = {
  id: ISSUER_ID,
  name: ISSUER_NAME,
  domain: ISSUER_DOMAIN,
};

/** A second issuer, so the admin issuer filter has something to narrow to. */
export const GLOBEX_ISSUER: CredentialIssuer = {
  id: 2,
  name: 'Globex Media',
  domain: 'globex-media.test',
};

export const ADMIN_REVOKER: CredentialRevoker = {
  id: ADMIN_ID,
  name: ADMIN_NAME,
  role: ClerkRole.Admin,
};

const ISSUER_REVOKER: CredentialRevoker = {
  id: ISSUER_ID,
  name: ISSUER_NAME,
  role: ClerkRole.Issuer,
};

export const BOB_GLOBEX_MEMBERSHIP_ID = '104';

/** A credential as the admin API stores it: the issuer-side record plus issuer and status-list index. */
export type AdminRecord = IssuedRecord & {
  issuer: CredentialIssuer | null;
  statusListIndex: number | null;
  revokedBy: CredentialRevoker | null;
};

const withAdminFields = (
  record: IssuedRecord,
  issuer: CredentialIssuer,
  statusListIndex: number | null,
): AdminRecord => ({
  ...record,
  issuer,
  statusListIndex,
  revokedBy:
    record.credential.status === CredentialVerificationStatus.Revoked
      ? ISSUER_REVOKER
      : null,
});

const GLOBEX_RECORD = membershipRecord({
  id: BOB_GLOBEX_MEMBERSHIP_ID,
  creator: CREATOR_BOB,
  issuedAt: '2026-09-12T10:00:00.000Z',
});

/** Every credential on the platform; Alice's revoked one predates the status list. */
export const ADMIN_RECORDS: AdminRecord[] = [
  ...ISSUED_RECORDS.map((record, index) =>
    withAdminFields(
      record,
      ACME_ISSUER,
      record.credential.status === CredentialVerificationStatus.Revoked
        ? null
        : index + 1,
    ),
  ),
  withAdminFields(GLOBEX_RECORD, GLOBEX_ISSUER, 10),
];

export const PENDING_ADMIN_CREDENTIAL: AdminCredential = {
  ...PENDING_REQUEST,
  issuer: ACME_ISSUER,
  revokedBy: null,
  statusList: null,
};

const CREATED_AT = '2026-01-10T09:00:00.000Z';

const adminUser = (
  id: number,
  role: ClerkRole,
  identity: Partial<AdminUser>,
  counts: AdminUser['counts'],
): AdminUser => ({
  id,
  role,
  name: null,
  email: null,
  didKey: `did:key:zDnaeUser${id}`,
  domain: null,
  didWeb: null,
  organizationName: null,
  createdAt: CREATED_AT,
  counts,
  ...identity,
});

const creatorUser = (creator: CredentialCreator, credentials: number) =>
  adminUser(
    creator.id,
    ClerkRole.Creator,
    { name: creator.name, email: creator.email, didKey: creator.didKey },
    { credentials, issuedCredentials: 0 },
  );

export const ADMIN_USERS: AdminUser[] = [
  adminUser(
    ACME_ISSUER.id,
    ClerkRole.Issuer,
    {
      organizationName: ISSUER_NAME,
      email: `issuer@${ISSUER_DOMAIN}`,
      domain: ISSUER_DOMAIN,
    },
    { credentials: 2, issuedCredentials: 4 },
  ),
  adminUser(
    GLOBEX_ISSUER.id,
    ClerkRole.Issuer,
    {
      organizationName: GLOBEX_ISSUER.name,
      email: `issuer@${GLOBEX_ISSUER.domain}`,
      domain: GLOBEX_ISSUER.domain,
    },
    { credentials: 1, issuedCredentials: 1 },
  ),
  creatorUser(CREATOR_ALICE, 5),
  creatorUser(CREATOR_BOB, 3),
  creatorUser(CREATOR_CAROL, 2),
];

export const adminStatsFor = (records: AdminRecord[]): AdminStats => {
  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const { credential } of records) {
    byStatus[credential.status ?? ''] =
      (byStatus[credential.status ?? ''] ?? 0) + 1;
    byType[credential.type] = (byType[credential.type] ?? 0) + 1;
  }
  return {
    users: { issuer: 2, creator: 3, admin: 1 },
    credentials: { byType, byStatus },
    revocationsLast30Days: byStatus[CredentialVerificationStatus.Revoked] ?? 0,
    generatedAt: CREATED_AT,
  };
};
