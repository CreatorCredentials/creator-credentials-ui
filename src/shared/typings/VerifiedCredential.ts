import { CredentialType } from './CredentialType';

export type VerifiedCredential = {
  id: string;
  type: CredentialType;
  data: Record<string, string>;
};
