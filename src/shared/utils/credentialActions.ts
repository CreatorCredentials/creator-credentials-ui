import { CredentialAction } from '@/shared/typings/CredentialAction';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';

const JWT_VERIFIER_URL = 'https://jwt.io/#token=';

type CredentialObjectWithProof = {
  credentialObject?: { proof?: { jwt?: string } };
};

export const credentialJwt = (
  credential: Pick<VerifiedCredentialsUnion, 'data'>,
): string | undefined =>
  (credential.data as CredentialObjectWithProof).credentialObject?.proof?.jwt;

/** "Verify" menu entry opening the credential JWT in an external verifier; empty when there is no JWT. */
export const verifyCredentialAction = (
  credential: Pick<VerifiedCredentialsUnion, 'data'>,
  label: string,
): CredentialAction[] => {
  const jwt = credentialJwt(credential);
  return jwt
    ? [
        {
          children: label,
          onClick: () =>
            window.open(
              `${JWT_VERIFIER_URL}${encodeURIComponent(jwt)}`,
              '_blank',
            ),
        },
      ]
    : [];
};
