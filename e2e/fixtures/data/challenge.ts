import { AcceptCredentialsIssuanceRequestResponse } from '@/api/requests/acceptCredentialsIssuanceRequest';
import { CredentialCreator } from '@/shared/typings/Credentials';
import { ISSUER_DID, PLATFORM_ISSUER_DID, SAMPLE_JWT } from './credentials';
import { ISSUER_NAME } from './users';

export const SIGNING_COMMAND =
  'printf %s "eyJhbGciOiJFUzI1NiJ9.eyJ2YyI6e319" | openssl dgst -sha256 -sign your_private_key.pem | base64';
export const CHALLENGE_CREDENTIAL_TYPE = 'VerifiableMembership';

/** Payload of `POST /v1/credentials/:id/accept` for a pending membership request. */
export const acceptChallengeFor = (
  requestId: string,
  subject: CredentialCreator,
): AcceptCredentialsIssuanceRequestResponse => ({
  challenge: {
    signingInput: 'eyJhbGciOiJFUzI1NiJ9.eyJ2YyI6e319',
    credentialObject: {
      id: `urn:uuid:e2e-${requestId}`,
      type: [
        'VerifiableCredential',
        'VerifiableAttestation',
        CHALLENGE_CREDENTIAL_TYPE,
      ],
      issuer: ISSUER_DID,
      validFrom: '2026-10-28T10:00:00.000Z',
      credentialSubject: { id: subject.didKey, memberOf: ISSUER_NAME },
    },
    initiatedAt: '2026-10-28T10:00:00.000Z',
  },
  commands: [SIGNING_COMMAND],
  supportingCredential: {
    credentialObject: {
      type: [
        'VerifiableCredential',
        'VerifiableAttestation',
        'EmailVerification',
      ],
      issuer: PLATFORM_ISSUER_DID,
      validFrom: '2026-01-10T09:00:00.000Z',
      credentialSubject: {
        id: subject.didKey,
        email: subject.email,
      },
    },
    proof: { type: 'JwtProof2020', jwt: SAMPLE_JWT },
  },
});
