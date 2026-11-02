/** `unknown`: no status entry and no platform record to check; `error`: the check failed, see `reason`. */
export type RevocationStatus = 'valid' | 'revoked' | 'unknown' | 'error';

/** Where a `valid` / `revoked` answer came from: the credential's status list, or the platform's own record of a credential issued without a status entry. */
export type RevocationSource = 'status-list' | 'platform-record';

export type RevocationErrorReason =
  | 'MALFORMED_VALUE_ERROR'
  | 'STATUS_RETRIEVAL_ERROR'
  | 'STATUS_VERIFICATION_ERROR'
  | 'STATUS_LIST_LENGTH_ERROR'
  | 'RANGE_ERROR'
  | 'UNSUPPORTED_STATUS_SIZE';

export type SignatureCheck = {
  valid: boolean;
  issuerDid: string | null;
  certificateSubject: string | null;
};

export type ValidityCheck = {
  valid: boolean;
  validFrom: string | null;
  validUntil: string | null;
};

export type RevocationCheck = {
  status: RevocationStatus;
  checkedAt: string;
  source?: RevocationSource;
  reason?: RevocationErrorReason;
};

export type VerificationChecks = {
  signature: SignatureCheck;
  validity: ValidityCheck;
  revocation: RevocationCheck;
};

/** Response of POST credentials/verify. */
export type CredentialVerificationResult = {
  valid: boolean;
  checks: VerificationChecks;
  credential: Record<string, unknown>;
};

/** Body of POST credentials/verify: a compact JWS or a credential object with `proof.jwt`. */
export type VerifyCredentialPayload =
  { jwt: string } | { credential: Record<string, unknown> };
