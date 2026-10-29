export type RevocationStatus = 'valid' | 'revoked' | 'unknown';

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
