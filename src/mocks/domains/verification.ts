import { rest } from 'msw';
import { ConfirmDomainTxtRecordCreationPayload } from '@/api/requests/confirmDomainTxtRecordCreation';
import {
  CreateTxtRecordForDomainPayload,
  CreateTxtRecordForDomainResponse,
} from '@/api/requests/createTxtRecordForDomain';
import {
  GenerateMetaMaskNoncePayload,
  GenerateMetaMaskNonceResponse,
} from '@/api/requests/generateMetaMaskNonce';
import { GetCreatorCredentialsResponse } from '@/api/requests/getCreatorCredentials';
import { CreatorCredentials } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { DEFAULT_MOCK_DELAY, MOCK_API_URL } from '../config';

export const MOCK_CREDENTIALS: CreatorCredentials = {
  email: {
    id: 'email-credential-id',
    type: CredentialType.Email,
    data: {
      address: 'testcreator@test.com',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
    },
    status: CredentialVerificationStatus.Success,
  },
  metaMask: {
    id: 'metamask-credential-id',
    type: CredentialType.Wallet,
    data: {
      address: '0x171147d85c5t54badb920fc7gfs6822e0132470c',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
    },
    status: CredentialVerificationStatus.Success,
  },
  domain: null,
  membership: [
    {
      id: 'membership-credential-id-1',
      type: CredentialType.Member,
      data: {
        companyName: 'Creator Credentials B.V.',
        requirements: 'Info about requirements',
      },
      status: CredentialVerificationStatus.Success,
    },
    {
      id: 'membership-credential-id-2',
      type: CredentialType.Member,
      data: {
        companyName: 'Posth Werk B.V.',
        requirements: 'Info about requirements',
      },
      status: CredentialVerificationStatus.Pending,
    },
  ],
};

export const verificationHandlers = [
  rest.get<GetCreatorCredentialsResponse>(
    `${MOCK_API_URL}/users/credentials`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetCreatorCredentialsResponse>(MOCK_CREDENTIALS),
      );
    },
  ),
  rest.post<GenerateMetaMaskNoncePayload, GenerateMetaMaskNonceResponse>(
    `${MOCK_API_URL}/users/nonce`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);
      const randomNonce = Math.floor(Math.random() * 1000000000);

      return res(delay, ctx.status(200), ctx.json({ nonce: randomNonce }));
    },
  ),
  rest.post<GenerateMetaMaskNoncePayload, GenerateMetaMaskNonceResponse>(
    `${MOCK_API_URL}/users/:walletAddress`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(delay, ctx.status(200));
    },
  ),
  rest.post<CreateTxtRecordForDomainPayload>(
    `${MOCK_API_URL}/verification/domain/txt-record`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(
        delay,
        ctx.status(201),
        ctx.json<CreateTxtRecordForDomainResponse>({
          txtRecord:
            '"cc-verification=0x3220916bf809914j82924bb8f32e1c396eba5c5 0b199a8ea7e37g6s99bcf141f1de226 4ded52ef3c0fb6cb79bd37j8237596b692dc37176ea78dc5c385fb1c"',
        }),
      );
    },
  ),
  rest.post<ConfirmDomainTxtRecordCreationPayload>(
    `${MOCK_API_URL}/verification/domain/confirm`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(delay, ctx.status(201));
    },
  ),
];
