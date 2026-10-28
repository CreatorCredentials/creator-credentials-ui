import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { IssuerConnectionStatus } from '@/shared/typings/IssuerConnectionStatus';
import { IssuerWithVerifiedCredentials } from '@/shared/typings/Issuer';
import { ISSUER_DOMAIN, ISSUER_NAME } from './users';

export const CONNECTED_ISSUER_ID = '20';
export const AVAILABLE_ISSUER_ID = '21';
export const PENDING_ISSUER_ID = '22';
export const AVAILABLE_ISSUER_NAME = 'Beta Guild';

/** Issuers as the creator sees them on `/v1/users/issuers`. */
export const CREATOR_ISSUERS: IssuerWithVerifiedCredentials[] = [
  {
    id: CONNECTED_ISSUER_ID,
    name: ISSUER_NAME,
    description: 'Publishing house issuing membership credentials',
    imageUrl: '',
    status: IssuerConnectionStatus.Connected,
    data: { domain: ISSUER_DOMAIN },
    fees: false,
    vcs: [
      {
        id: '301',
        type: CredentialType.Member,
        status: CredentialVerificationStatus.Success,
        data: { companyName: ISSUER_NAME },
      },
    ],
  },
  {
    id: AVAILABLE_ISSUER_ID,
    name: AVAILABLE_ISSUER_NAME,
    description: 'Guild for independent creators',
    imageUrl: '',
    status: IssuerConnectionStatus.NotStarted,
    data: { domain: 'beta-guild.test' },
    fees: false,
    vcs: [],
  },
  {
    id: PENDING_ISSUER_ID,
    name: 'Gamma Press',
    description: 'Connection request awaiting approval',
    imageUrl: '',
    status: IssuerConnectionStatus.Pending,
    data: { domain: 'gamma-press.test' },
    fees: true,
    vcs: [],
  },
];
