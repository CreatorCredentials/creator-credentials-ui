import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { IssuerWithVerifiedCredentials } from '@/shared/typings/Issuer';
import { IssuerConnectionStatus } from '@/shared/typings/IssuerConnectionStatus';

export const MOCK_CREDENTIALS: VerifiedCredentialsUnion[] = [
  {
    id: '1',
    type: CredentialType.Email,
    data: {
      address: 'testcreator@test.com',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
    },
    status: CredentialVerificationStatus.Success,
  },
  {
    id: '2',
    type: CredentialType.Wallet,
    data: {
      address: '0x171147d85c5t54badb920fc7gfs6822e0132470c',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
    },
    status: CredentialVerificationStatus.Success,
  },
];

export const MOCK_ISSUERS: IssuerWithVerifiedCredentials[] = [
  {
    id: '1',
    name: 'Creator Credentials B.V.',
    description:
      'Based in the Netherlands, supporting creators credentials worldwide',
    imageUrl: '/images/brand.svg',
    data: {
      domain: 'creatorcredentials.com',
      requirements: 'Info about requirements',
    },
    fees: true,
    status: IssuerConnectionStatus.Connected,
    vcs: MOCK_CREDENTIALS,
  },
  {
    id: '2',
    name: 'Posth Werk B.V.',
    description:
      'Based in the Netherlands, supporting creators in the music industry',
    imageUrl: '/images/posth-werk.svg',
    data: {
      domain: 'posth.me',
      requirements: 'Info about requirements',
    },
    fees: true,
    status: IssuerConnectionStatus.Connected,
    vcs: MOCK_CREDENTIALS,
  },
  {
    id: '3',
    name: 'Liccium',
    description: `Liccium helps creators to inseparably bind public and verifiable claims to their content.`,
    imageUrl: '/images/liccium.svg',
    data: {
      domain: 'liccium.com',
      requirements: 'Info about requirements',
    },
    fees: false,
    status: IssuerConnectionStatus.Pending,
    vcs: MOCK_CREDENTIALS,
  },
  {
    id: '4',
    name: 'Alternative Artists Association',
    description: `The AAA is supporting alternative artists worldwide`,
    imageUrl: '/images/icons/schedule.svg',
    data: {
      domain: 'aaa.com',
      requirements: 'Info about requirements',
    },
    fees: true,
    status: IssuerConnectionStatus.NotStarted,
    vcs: MOCK_CREDENTIALS,
  },
  {
    id: '5',
    name: 'News VerifiedCredential Service',
    description: `The NCS is a NGO, supporting news journalists and photographers worldwide`,
    imageUrl: '/images/icons/caption-filled.svg',
    data: {
      domain: 'NCS-credentials.com',
      requirements: 'Info about requirements',
    },
    fees: true,
    status: IssuerConnectionStatus.NotStarted,
    vcs: MOCK_CREDENTIALS,
  },
  {
    id: '6',
    name: 'Videographic Trust',
    description: `This trust service works with vloggers, film makers and documentarists `,
    imageUrl: '/images/icons/verified-filled.svg',
    data: {
      domain: 'trust.video',
      requirements: 'Info about requirements',
    },
    fees: true,
    status: IssuerConnectionStatus.NotStarted,
    vcs: MOCK_CREDENTIALS,
    additionalVerificationSteps: true,
  },
];
