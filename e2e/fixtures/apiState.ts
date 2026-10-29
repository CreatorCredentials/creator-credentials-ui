import { AcceptCredentialsIssuanceRequestResponse } from '@/api/requests/acceptCredentialsIssuanceRequest';
import { User } from '@/api/requests/getUser';
import { SendCredentialsRequestPayload } from '@/api/requests/sendCredentialsRequest';
import { GetAdminCredentialsSearchParams } from '@/api/requests/getAdminCredentials';
import { GetAdminUsersSearchParams } from '@/api/requests/getAdminUsers';
import { AdminStats } from '@/shared/typings/AdminStats';
import { AdminUser } from '@/shared/typings/AdminUser';
import { Creator } from '@/shared/typings/Creator';
import { CredentialVerificationResult } from '@/shared/typings/CredentialVerification';
import {
  AdminCredential,
  CreatorCredentials,
  IssuedCredential,
} from '@/shared/typings/Credentials';
import { Page } from '@/shared/typings/Page';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { IssuerConnectionStatus } from '@/shared/typings/IssuerConnectionStatus';
import { IssuerProfile } from '@/shared/typings/IssuerProfile';
import { IssuerWithVerifiedCredentials } from '@/shared/typings/Issuer';
import { VerifiedCredentialsTemplate } from '@/shared/typings/Templates';
import {
  ADMIN_RECORDS,
  ADMIN_REVOKER,
  ADMIN_USERS,
  AdminRecord,
  adminStatsFor,
  PENDING_ADMIN_CREDENTIAL,
  STATUS_LIST_CREDENTIAL_URL,
} from './data/admin';
import { acceptChallengeFor } from './data/challenge';
import {
  ALICE_CONNECT_CREDENTIAL,
  ALICE_EMAIL_CREDENTIAL,
  ALICE_VERIFIED_CREATOR_CREDENTIAL,
  ISSUED_RECORDS,
  IssuedRecord,
  PENDING_REQUEST,
} from './data/credentials';
import { CREATOR_ISSUERS } from './data/issuers';
import { CREATOR_TEMPLATES } from './data/templates';
import {
  ADMIN_NAME,
  CREATOR_ALICE,
  ISSUER_CREATORS,
  profileFor,
  userFor,
} from './data/users';
import { Role } from './env';

export type ApiFlags = {
  /** `POST /v1/credentials/:id/revoke` and `POST /v1/admin/credentials/:id/revoke` answer 500. */
  failRevoke: boolean;
  /** `GET /v1/credentials/issuers?status=SUCCESS|REVOKED` answers 500. */
  failIssuedList: boolean;
};

export type ApiScenario = { role: Role } & Partial<ApiFlags>;

export type ApiCall = { method: string; path: string };

export type RevokeOutcome =
  | { kind: 'revoked'; credential: IssuedCredential }
  | { kind: 'pending' }
  | { kind: 'not-found' };

export type AdminRevokeOutcome =
  { kind: 'revoked'; credential: AdminCredential } | { kind: 'not-found' };

const DEFAULT_PAGE_SIZE = 20;

/** Timestamp written by every mutation so assertions stay deterministic. */
export const MUTATION_TIMESTAMP = '2026-10-28T12:00:00.000Z';
export const OUTSIDE_REVOCATION_REASON = 'Revoked from another session';

const toIssuedCredential = (record: IssuedRecord): IssuedCredential => ({
  ...record.credential,
  issuedAt: record.issuedAt,
  updatedAt: record.updatedAt,
  connectionStatus: record.connectionStatus,
  creator: record.creator,
});

const toAdminCredential = (record: AdminRecord): AdminCredential => ({
  ...toIssuedCredential(record),
  issuer: record.issuer,
  revokedBy: record.revokedBy,
  statusList:
    record.statusListIndex === null
      ? null
      : {
          credential: STATUS_LIST_CREDENTIAL_URL,
          index: record.statusListIndex,
        },
});

const contains = (value: string | null | undefined, needle: string) =>
  Boolean(value) && (value as string).toLowerCase().includes(needle);

const matchesSearch = (credential: AdminCredential, q: string): boolean => {
  const needle = q.toLowerCase();
  return (
    contains(credential.creator?.name, needle) ||
    contains(credential.creator?.email, needle) ||
    contains(credential.creator?.didKey, needle) ||
    contains(credential.issuer?.name, needle)
  );
};

const matchesUserSearch = (user: AdminUser, q: string): boolean => {
  const needle = q.toLowerCase();
  return (
    contains(user.name, needle) ||
    contains(user.organizationName, needle) ||
    contains(user.email, needle) ||
    contains(user.didKey, needle)
  );
};

const newestFirst = (
  a: { issuedAt?: string | null },
  b: { issuedAt?: string | null },
) => Date.parse(b.issuedAt ?? '') - Date.parse(a.issuedAt ?? '');

const paginate = <T>(
  items: T[],
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Page<T> => ({
  items: items.slice((page - 1) * pageSize, page * pageSize),
  total: items.length,
  page,
  pageSize,
});

const jwtOf = (body: unknown): string | null => {
  if (typeof body !== 'object' || body === null) {
    return null;
  }
  const { jwt, credential } = body as {
    jwt?: unknown;
    credential?: { proof?: { jwt?: unknown } };
  };
  const candidate = jwt ?? credential?.proof?.jwt;
  return typeof candidate === 'string' ? candidate : null;
};

const toCreatorCredential = (record: IssuedRecord) => ({
  ...record.credential,
  issuedAt: record.issuedAt,
  updatedAt: record.updatedAt,
});

/** Mutable backend stand-in for one test: mutations change what later requests return. */
export class ApiState {
  readonly role: Role;
  readonly flags: ApiFlags;
  readonly calls: ApiCall[] = [];
  readonly credentialRequests: SendCredentialsRequestPayload[] = [];
  private readonly issued: IssuedRecord[];
  private readonly adminRecords: AdminRecord[];
  private readonly pendingRequests: IssuedCredential[];
  private readonly issuersOfCreator: IssuerWithVerifiedCredentials[];

  constructor({
    role,
    failRevoke = false,
    failIssuedList = false,
  }: ApiScenario) {
    this.role = role;
    this.flags = { failRevoke, failIssuedList };
    this.issued = structuredClone(ISSUED_RECORDS);
    this.adminRecords = structuredClone(ADMIN_RECORDS);
    this.pendingRequests = structuredClone([PENDING_REQUEST]);
    this.issuersOfCreator = structuredClone(CREATOR_ISSUERS);
  }

  recordCall(method: string, path: string): void {
    this.calls.push({ method, path });
  }

  countCalls(method: string, path: string): number {
    return this.calls.filter(
      (call) => call.method === method && call.path === path,
    ).length;
  }

  user(): User {
    return userFor(this.role);
  }

  profile(): IssuerProfile {
    return profileFor(this.role);
  }

  issuedCredentials(status: string): IssuedCredential[] {
    if (status === CredentialVerificationStatus.Pending) {
      return this.pendingRequests;
    }
    return this.issued
      .filter((record) => record.credential.status === status)
      .map(toIssuedCredential);
  }

  revoke(id: string, reason?: string): RevokeOutcome {
    if (this.pendingRequests.some((request) => request.id === id)) {
      return { kind: 'pending' };
    }
    const record = this.issued.find((entry) => entry.credential.id === id);
    if (!record) {
      return { kind: 'not-found' };
    }
    if (record.credential.status !== CredentialVerificationStatus.Revoked) {
      record.credential.status = CredentialVerificationStatus.Revoked;
      record.credential.revokedAt = MUTATION_TIMESTAMP;
      record.credential.revokedReason = reason ?? null;
      record.credential.updatedAt = MUTATION_TIMESTAMP;
      record.updatedAt = MUTATION_TIMESTAMP;
    }
    return { kind: 'revoked', credential: toIssuedCredential(record) };
  }

  /** The issuer revokes from elsewhere; the next creator fetch reflects it. */
  revokeFromOutside(id: string, reason = OUTSIDE_REVOCATION_REASON): void {
    const outcome = this.revoke(id, reason);
    if (outcome.kind !== 'revoked') {
      throw new Error(`Cannot revoke credential ${id}: ${outcome.kind}`);
    }
  }

  creatorCredentials(): CreatorCredentials {
    return {
      email: ALICE_EMAIL_CREDENTIAL,
      wallet: null,
      domain: null,
      connect: ALICE_CONNECT_CREDENTIAL,
      membership: this.issued
        .filter((record) => record.creator.id === CREATOR_ALICE.id)
        .map(toCreatorCredential),
      keypairVerifications: [],
      verifiableCreator: ALICE_VERIFIED_CREATOR_CREDENTIAL,
    };
  }

  creators(status: string): Creator[] {
    return ISSUER_CREATORS.filter((creator) => creator.status === status);
  }

  issuers(): IssuerWithVerifiedCredentials[] {
    return this.issuersOfCreator;
  }

  issuerById(id: string): IssuerWithVerifiedCredentials | undefined {
    return this.issuersOfCreator.find((issuer) => issuer.id === id);
  }

  confirmConnectionRequest(issuerId: string): boolean {
    const issuer = this.issuerById(issuerId);
    if (!issuer) {
      return false;
    }
    issuer.status = IssuerConnectionStatus.Pending;
    return true;
  }

  recordCredentialRequest(payload: SendCredentialsRequestPayload): void {
    this.credentialRequests.push(payload);
  }

  acceptChallenge(
    credentialId: string,
  ): AcceptCredentialsIssuanceRequestResponse | null {
    const request = this.pendingRequests.find(
      (entry) => entry.id === credentialId,
    );
    return request?.creator
      ? acceptChallengeFor(request.id, request.creator)
      : null;
  }

  templates(): VerifiedCredentialsTemplate[] {
    return CREATOR_TEMPLATES;
  }

  /** Every credential across issuers, including the pending request, newest first. */
  private allAdminCredentials(): AdminCredential[] {
    return [
      ...this.adminRecords.map(toAdminCredential),
      PENDING_ADMIN_CREDENTIAL,
    ].sort(newestFirst);
  }

  adminCredentials(
    params: GetAdminCredentialsSearchParams,
  ): Page<AdminCredential> {
    const items = this.allAdminCredentials().filter(
      (credential) =>
        (!params.status || credential.status === params.status) &&
        (!params.type || credential.type === params.type) &&
        (!params.issuerId || credential.issuer?.id === params.issuerId) &&
        (!params.q || matchesSearch(credential, params.q)),
    );
    return paginate(items, params.page, params.pageSize);
  }

  adminCredential(id: string): AdminCredential | undefined {
    return this.allAdminCredentials().find(
      (credential) => credential.id === id,
    );
  }

  adminRevoke(id: string, reason?: string): AdminRevokeOutcome {
    const record = this.adminRecords.find(
      (entry) => entry.credential.id === id,
    );
    if (!record) {
      return { kind: 'not-found' };
    }
    if (record.credential.status !== CredentialVerificationStatus.Revoked) {
      record.credential.status = CredentialVerificationStatus.Revoked;
      record.credential.revokedAt = MUTATION_TIMESTAMP;
      record.credential.revokedReason = reason ?? null;
      record.credential.updatedAt = MUTATION_TIMESTAMP;
      record.updatedAt = MUTATION_TIMESTAMP;
      record.revokedBy = { ...ADMIN_REVOKER, name: ADMIN_NAME };
    }
    return { kind: 'revoked', credential: toAdminCredential(record) };
  }

  adminUsers(params: GetAdminUsersSearchParams): Page<AdminUser> {
    const items = ADMIN_USERS.filter(
      (user) =>
        (!params.role || user.role === params.role) &&
        (!params.q || matchesUserSearch(user, params.q)),
    );
    return paginate(items, params.page, params.pageSize);
  }

  adminStats(): AdminStats {
    return adminStatsFor(this.adminRecords);
  }

  /** Signature holds for any fixture JWS; revocation follows the record it signs. */
  verify(body: unknown): CredentialVerificationResult | null {
    const jwt = jwtOf(body);
    if (!jwt) {
      return null;
    }
    const checkedAt = MUTATION_TIMESTAMP;
    const signed = this.adminRecords
      .map(toAdminCredential)
      .find(
        (credential) => credential.data.credentialObject?.proof?.jwt === jwt,
      );
    if (!signed) {
      return {
        valid: false,
        checks: {
          signature: {
            valid: false,
            issuerDid: null,
            certificateSubject: null,
          },
          validity: { valid: false, validFrom: null, validUntil: null },
          revocation: { status: 'unknown', checkedAt },
        },
        credential: {},
      };
    }
    const { proof, ...credential } = signed.data.credentialObject;
    const revoked = signed.status === CredentialVerificationStatus.Revoked;
    return {
      valid: !revoked,
      checks: {
        signature: {
          valid: true,
          issuerDid: credential.issuer,
          certificateSubject: `CN=${signed.issuer?.name ?? ''}`,
        },
        validity: {
          valid: true,
          validFrom: credential.validFrom,
          validUntil: null,
        },
        revocation: {
          status: revoked ? 'revoked' : signed.statusList ? 'valid' : 'unknown',
          checkedAt,
        },
      },
      credential,
    };
  }
}
