import { CredentialType } from './CredentialType';
import { CredentialVerificationStatus } from './CredentialVerificationStatus';

type BaseCredential<T extends CredentialType, D extends object> = {
  id: string;
  status?: CredentialVerificationStatus;
  type: T;
  data: D;
};

export type EmailCredential = BaseCredential<
  CredentialType.Email,
  {
    address: string;
    requirements?: string;
    companyName?: string;
  }
>;

export type WalletCredential = BaseCredential<
  CredentialType.Wallet,
  {
    address: string;
    companyName?: string;
    requirements?: string;
  }
>;

export type DomainCredential = BaseCredential<
  CredentialType.Domain,
  {
    domain: string;
  }
>;

export type MembershipCredential = BaseCredential<
  CredentialType.Member,
  {
    companyName?: string;
    requirements?: string;
    validity?: string;
  }
>;

export type VerifiedCredentialsUnion =
  | EmailCredential
  | WalletCredential
  | DomainCredential
  | MembershipCredential;

export type CreatorCredentials = {
  email: EmailCredential;
  metaMask: WalletCredential | null;
  domain: DomainCredential | null;
  membership: MembershipCredential[];
};
