import { CreatorConnectionStatus } from '@/shared/typings/CreatorConnectionStatus';
import {
  ConnectCredential,
  CreatorCredential,
  CredentialCreator,
  DataSupplierCredential,
  EmailCredential,
  IssuedCredential,
  MembershipCredential,
} from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import {
  CREATOR_ALICE,
  CREATOR_BOB,
  CREATOR_CAROL,
  ISSUER_DOMAIN,
  ISSUER_NAME,
  PLATFORM_HOST,
} from './users';

export const PLATFORM_ISSUER_DID = `did:web:${PLATFORM_HOST}`;
export const ISSUER_DID = `did:web:${ISSUER_DOMAIN}`;
export const VERIFIABLE_CREATOR_TYPE = 'VerifiableCreator';
const SAMPLE_JWT_HEADER = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9';
const SAMPLE_JWT_PAYLOAD = 'eyJ2YyI6e319';

/** Deterministic stand-in for the compact JWS that signs credential `id`. */
export const jwtFor = (id: string): string =>
  `${SAMPLE_JWT_HEADER}.${SAMPLE_JWT_PAYLOAD}.sig-${id}`;

export const SAMPLE_JWT = jwtFor('sample');
/** A JWS no fixture credential was signed with: the verifier rejects its signature. */
export const TAMPERED_JWT = `${SAMPLE_JWT_HEADER}.${SAMPLE_JWT_PAYLOAD}.tampered`;

type Revocation = {
  at: string;
  reason: string | null;
};

/** One credential as stored by the backend: the creator's copy plus the issuer-side relation. */
export type IssuedRecord = {
  credential: MembershipCredential | DataSupplierCredential;
  issuedAt: string;
  updatedAt: string;
  creator: CredentialCreator;
  connectionStatus: CreatorConnectionStatus | null;
};

export const credentialObject = (
  id: string,
  type: string,
  subject: CredentialCreator,
  validFrom: string,
  claims: Record<string, string>,
  issuer = ISSUER_DID,
) => ({
  '@context': ['https://www.w3.org/ns/credentials/v2'],
  id: `urn:uuid:e2e-${id}`,
  type: ['VerifiableCredential', 'VerifiableAttestation', type],
  issuer,
  validFrom,
  credentialSubject: { id: subject.didKey, ...claims },
  proof: { type: 'JwtProof2020', jwt: jwtFor(id) },
});

export type MembershipInput = {
  id: string;
  creator: CredentialCreator;
  issuedAt: string;
  connectionStatus?: CreatorConnectionStatus;
  revoked?: Revocation;
};

export const membershipRecord = ({
  id,
  creator,
  issuedAt,
  connectionStatus = CreatorConnectionStatus.Accepted,
  revoked,
}: MembershipInput): IssuedRecord => ({
  credential: {
    id,
    type: CredentialType.Member,
    status: revoked
      ? CredentialVerificationStatus.Revoked
      : CredentialVerificationStatus.Success,
    issuedAt,
    updatedAt: revoked?.at ?? issuedAt,
    revokedAt: revoked?.at ?? null,
    revokedReason: revoked?.reason ?? null,
    data: {
      companyName: ISSUER_NAME,
      validity: '12 months',
      requirements: 'Active membership',
      userId: creator.id,
      credentialObject: credentialObject(
        id,
        'VerifiableMembership',
        creator,
        issuedAt,
        { memberOf: ISSUER_NAME },
      ),
    },
  },
  issuedAt,
  updatedAt: revoked?.at ?? issuedAt,
  creator,
  connectionStatus,
});

const dataSupplierRecord = ({
  id,
  creator,
  issuedAt,
  connectionStatus = CreatorConnectionStatus.Accepted,
}: MembershipInput): IssuedRecord => ({
  credential: {
    id,
    type: CredentialType.DataSupplier,
    status: CredentialVerificationStatus.Success,
    issuedAt,
    updatedAt: issuedAt,
    revokedAt: null,
    revokedReason: null,
    data: {
      companyName: ISSUER_NAME,
      userId: creator.id,
      credentialObject: credentialObject(
        id,
        'VerifiableDataSupplier',
        creator,
        issuedAt,
        { dataSupplierFor: ISSUER_NAME },
      ),
    },
  },
  issuedAt,
  updatedAt: issuedAt,
  creator,
  connectionStatus,
});

export const ALICE_MEMBERSHIP_ID = '101';
export const BOB_MEMBERSHIP_ID = '102';
export const CAROL_DATA_SUPPLIER_ID = '103';
export const ALICE_REVOKED_MEMBERSHIP_ID = '105';
export const PENDING_REQUEST_ID = '201';

export const ALICE_REVOKED_AT = '2026-10-20T10:00:00.000Z';
export const ALICE_REVOKED_REASON = 'Membership ended';

/** Issued by the signed-in issuer; the creator test user is Alice. */
export const ISSUED_RECORDS: IssuedRecord[] = [
  membershipRecord({
    id: ALICE_MEMBERSHIP_ID,
    creator: CREATOR_ALICE,
    issuedAt: '2026-06-01T10:00:00.000Z',
  }),
  membershipRecord({
    id: BOB_MEMBERSHIP_ID,
    creator: CREATOR_BOB,
    issuedAt: '2026-10-05T10:00:00.000Z',
  }),
  dataSupplierRecord({
    id: CAROL_DATA_SUPPLIER_ID,
    creator: CREATOR_CAROL,
    issuedAt: '2026-03-15T10:00:00.000Z',
    connectionStatus: CreatorConnectionStatus.Revoked,
  }),
  membershipRecord({
    id: ALICE_REVOKED_MEMBERSHIP_ID,
    creator: CREATOR_ALICE,
    issuedAt: '2026-02-01T10:00:00.000Z',
    revoked: { at: ALICE_REVOKED_AT, reason: ALICE_REVOKED_REASON },
  }),
];

/** A membership request waiting for the issuer on `/issuer/credentials/requested`. */
export const PENDING_REQUEST: IssuedCredential = {
  id: PENDING_REQUEST_ID,
  type: CredentialType.Member,
  status: CredentialVerificationStatus.Pending,
  issuedAt: '2026-10-27T08:00:00.000Z',
  updatedAt: '2026-10-27T08:00:00.000Z',
  revokedAt: null,
  revokedReason: null,
  connectionStatus: CreatorConnectionStatus.Accepted,
  creator: CREATOR_ALICE,
  data: { companyName: ISSUER_NAME, userId: CREATOR_ALICE.id },
};

export const ALICE_EMAIL_CREDENTIAL: EmailCredential = {
  id: '1',
  type: CredentialType.Email,
  status: CredentialVerificationStatus.Success,
  data: {
    address: CREATOR_ALICE.email ?? '',
    userId: CREATOR_ALICE.id,
    credentialObject: {
      ...credentialObject(
        'email',
        'EmailVerification',
        CREATOR_ALICE,
        '2026-01-10T09:00:00.000Z',
        { email: CREATOR_ALICE.email ?? '' },
      ),
      issuer: PLATFORM_ISSUER_DID,
    },
  },
};

export const ALICE_CONNECT_CREDENTIAL: ConnectCredential = {
  id: '2',
  type: CredentialType.Connect,
  status: CredentialVerificationStatus.Success,
  data: {
    userId: CREATOR_ALICE.id,
    credentialObject: {
      ...credentialObject(
        'connect',
        'VerifiableConnect',
        CREATOR_ALICE,
        '2026-01-12T09:00:00.000Z',
        {},
      ),
      issuer: PLATFORM_ISSUER_DID,
    },
  },
};

export const VERIFIED_CREATOR_VALID_FROM = '2026-01-12T09:05:00.000Z';

export const ALICE_VERIFIED_CREATOR_CREDENTIAL: CreatorCredential = {
  id: '3',
  type: CredentialType.Creator,
  status: CredentialVerificationStatus.Success,
  data: {
    verifiedBy: PLATFORM_HOST,
    userId: CREATOR_ALICE.id,
    credentialObject: {
      ...credentialObject(
        'creator',
        VERIFIABLE_CREATOR_TYPE,
        CREATOR_ALICE,
        VERIFIED_CREATOR_VALID_FROM,
        { verifiedBy: PLATFORM_HOST },
      ),
      issuer: PLATFORM_ISSUER_DID,
    },
  },
};
