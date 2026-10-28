import { AcceptCredentialsIssuanceRequestResponse } from '@/api/requests/acceptCredentialsIssuanceRequest';
import { User } from '@/api/requests/getUser';
import { SendCredentialsRequestPayload } from '@/api/requests/sendCredentialsRequest';
import { Creator } from '@/shared/typings/Creator';
import {
  CreatorCredentials,
  IssuedCredential,
} from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { IssuerConnectionStatus } from '@/shared/typings/IssuerConnectionStatus';
import { IssuerProfile } from '@/shared/typings/IssuerProfile';
import { IssuerWithVerifiedCredentials } from '@/shared/typings/Issuer';
import { VerifiedCredentialsTemplate } from '@/shared/typings/Templates';
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
  CREATOR_ALICE,
  ISSUER_CREATORS,
  profileFor,
  userFor,
} from './data/users';
import { Role } from './env';

export type ApiFlags = {
  /** `POST /v1/credentials/:id/revoke` answers 500. */
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
}
