import { CredentialAction } from '@/shared/typings/CredentialAction';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { config } from '@/shared/constants/config';

const JWT_VERIFIER_URL = 'https://jwt.io/#token=';
const PLATFORM_STATUS_LIST_PATH = '/v1/status-lists/1';

type CredentialObjectWithProof = {
  credentialObject?: {
    proof?: { jwt?: string };
    credentialStatus?: { statusListCredential?: string };
  };
};

/** The W3C Bitstring Status List this credential's revocation bit lives in, when it has an entry. */
export const statusListUrlOf = (
  credential: Pick<VerifiedCredentialsUnion, 'data'>,
): string | undefined =>
  (credential.data as CredentialObjectWithProof).credentialObject
    ?.credentialStatus?.statusListCredential;

/** The platform's own revocation list, served publicly by the backend. */
export const platformStatusListUrl = (): string =>
  `${config.NEST_API_URL.replace(/\/$/, '')}${PLATFORM_STATUS_LIST_PATH}`;

const openInNewTab = (url: string) => window.open(url, '_blank', 'noopener');

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
            openInNewTab(`${JWT_VERIFIER_URL}${encodeURIComponent(jwt)}`),
        },
      ]
    : [];
};

/** "Revocation list" menu entry opening the status list the credential is registered in; empty without an entry. */
export const revocationListAction = (
  credential: Pick<VerifiedCredentialsUnion, 'data'>,
  label: string,
): CredentialAction[] => {
  const url = statusListUrlOf(credential);
  return url
    ? [
        {
          children: label,
          onClick: () => openInNewTab(url),
          'data-testid': 'credential-revocation-list',
        },
      ]
    : [];
};
