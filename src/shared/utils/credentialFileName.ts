import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';

const credentialSubject = (
  credential: VerifiedCredentialsUnion,
): string | undefined => {
  switch (credential.type) {
    case CredentialType.Domain:
    case CredentialType.DidWeb:
      return credential.data.domain;
    case CredentialType.Email:
    case CredentialType.Wallet:
      return credential.data.address;
    case CredentialType.Member:
    case CredentialType.DataSupplier:
    case CredentialType.LicciumDataSupplier:
      return credential.data.companyName;
    case CredentialType.Creator:
      return credential.data.verifiedBy;
    case CredentialType.Connect:
    case CredentialType.ExternalKeypairVerification:
      return undefined;
  }
};

/** File name (without extension) for a downloaded credential object. */
export const credentialFileName = (
  credential: VerifiedCredentialsUnion,
): string =>
  [
    credentialSubject(credential) ?? credential.type.toLowerCase(),
    credential.data.credentialObject?.validFrom,
  ]
    .filter(Boolean)
    .join(' ');
