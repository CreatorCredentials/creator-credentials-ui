import { CreatorConnectionStatus } from './CreatorConnectionStatus';
import { CredentialType } from './CredentialType';
import { CredentialVerificationStatus } from './CredentialVerificationStatus';

type BaseCredential<T extends CredentialType, D extends object> = {
  id: string;
  status?: CredentialVerificationStatus;
  type: T;
  data: D;
  issuedAt?: string | null;
  updatedAt?: string | null;
  revokedAt?: string | null;
  revokedReason?: string | null;
};

export type EmailCredential = BaseCredential<
  CredentialType.Email,
  {
    address: string;
    requirements?: string;
    companyName?: string;
    userId?: number;
    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type WalletCredential = BaseCredential<
  CredentialType.Wallet,
  {
    address: string;
    companyName?: string;
    requirements?: string;
    userId?: number;

    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type DomainCredential = BaseCredential<
  CredentialType.Domain,
  {
    domain: string;
    companyName?: string;
    requirements?: string;
    userId?: number;

    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type MembershipCredential = BaseCredential<
  CredentialType.Member,
  {
    companyName?: string;
    requirements?: string;
    validity?: string;
    userId?: number;

    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type DataSupplierCredential = BaseCredential<
  CredentialType.DataSupplier,
  {
    companyName?: string;
    requirements?: string;
    validity?: string;
    userId?: number;

    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type LicciumDataSupplierCredential = BaseCredential<
  CredentialType.LicciumDataSupplier,
  {
    companyName?: string;
    requirements?: string;
    validity?: string;
    userId?: number;

    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type ConnectCredential = BaseCredential<
  CredentialType.Connect,
  {
    companyName?: string;
    requirements?: string;
    validity?: string;
    userId?: number;
    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type DidWebCredential = BaseCredential<
  CredentialType.DidWeb,
  {
    domain: string;
    companyName?: string;
    requirements?: string;
    userId?: number;

    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type ExternalKeypairVerificationCredential = BaseCredential<
  CredentialType.ExternalKeypairVerification,
  {
    sameAs?: string;
    userId?: number;
    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type CreatorCredential = BaseCredential<
  CredentialType.Creator,
  {
    verifiedBy: string;
    userId?: number;
    // eslint-disable-next-line
    credentialObject?: any;
  }
>;

export type VerifiedCredentialsUnion =
  | EmailCredential
  | WalletCredential
  | DomainCredential
  | MembershipCredential
  | DataSupplierCredential
  | LicciumDataSupplierCredential
  | ConnectCredential
  | DidWebCredential
  | ExternalKeypairVerificationCredential
  | CreatorCredential;

export type CredentialCreator = {
  id: number;
  name: string | null;
  email: string | null;
  didKey: string;
};

/** A credential as listed for its issuer: carries the creator it was issued to. */
export type IssuedCredential = VerifiedCredentialsUnion & {
  issuedAt?: string | null;
  updatedAt?: string | null;
  connectionStatus?: CreatorConnectionStatus | null;
  creator?: CredentialCreator | null;
};

export type CreatorCredentials = {
  email: EmailCredential;
  wallet: WalletCredential | null;
  domain: DomainCredential | null;
  connect: ConnectCredential | null;
  membership: (
    | MembershipCredential
    | DataSupplierCredential
    | LicciumDataSupplierCredential
  )[];
  keypairVerifications: ExternalKeypairVerificationCredential[];
  verifiableCreator: CreatorCredential | null;
};

export type IssuerCredentials = {
  email: EmailCredential;
  domain: DomainCredential | null;
  didWeb: DidWebCredential | null;
  membership: MembershipCredential[];
};

export type CredentialIssuer = {
  id: number;
  name: string | null;
  domain: string | null;
};

export type CredentialRevoker = {
  id: number;
  name: string | null;
  role: string;
};

/** Entry of the platform's Bitstring Status List the credential is checked against. */
export type StatusListEntry = {
  credential: string;
  index: number;
};

/** A credential as listed for the platform admin: creator, issuer, revoker and status-list entry. */
export type AdminCredential = IssuedCredential & {
  issuer: CredentialIssuer | null;
  revokedBy: CredentialRevoker | null;
  statusList: StatusListEntry | null;
};
