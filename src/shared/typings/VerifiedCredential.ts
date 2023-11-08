import { CredentialType } from './CredentialType';
import { CredentialVerificationStatus } from './CredentialVerificationStatus';

export type VerifiedCredential = {
  id: string;
  type: CredentialType;
  data: Record<string, string>;
  status: CredentialVerificationStatus;
};
