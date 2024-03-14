import {
  CreatorCredentials,
  DomainCredential,
  EmailCredential,
  WalletCredential,
} from '@/shared/typings/Credentials';
import { getHeaders } from '@/shared/utils/tokenHeader';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialType } from '@/shared/typings/CredentialType';
import axios, { AxiosRequestConfig } from '../axiosNest';

export type GetCreatorCredentialsResponse = CreatorCredentials;

export const getCreatorCredentials = (
  token: string,
  config?: AxiosRequestConfig,
) =>
  axios
    .get<GetCreatorCredentialsResponse>('/v1/users/credentials', {
      ...config,
      ...getHeaders(token),
    })
    .then((res) => ({
      data: {
        email: formatEmailCredential(res.data.email),
        wallet: res.data.wallet
          ? formatWalletCredential(res.data.wallet)
          : null,
        domain: res.data.domain
          ? formatDomainCredential(res.data.domain)
          : null,
        membership: [],
      },
    }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatEmailCredential(credential: any): EmailCredential {
  return {
    id: credential.id,
    status: CredentialVerificationStatus.Success,
    type: CredentialType.Email,
    data: {
      address: credential.credentialSubject.email || 'wrong',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
      credentialObject: credential,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatWalletCredential(credential: any): WalletCredential {
  return {
    id: credential.id,
    status: CredentialVerificationStatus.Success,
    type: CredentialType.Wallet,
    data: {
      address: credential.credentialSubject.walletAddress || 'wrong',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
      credentialObject: credential,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatDomainCredential(credential: any): DomainCredential {
  return {
    id: credential.id,
    status: credential.status,
    type: CredentialType.Domain,
    data: {
      domain: credential.domain || 'wrong',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
      credentialObject: credential,
    },
  };
}
