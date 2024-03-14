import {
  EmailCredential,
  WalletCredential,
} from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialType } from '@/shared/typings/CredentialType';
import { getHeaders } from '@/shared/utils/tokenHeader';
import nestInstance, { AxiosRequestConfig } from '../axiosNest';
// eslint-disable-next-line
export type GetEmailCredentialResponse = {
  emailCredential: EmailCredential;
  walletCredential?: WalletCredential;
};

export const getEmailCredential = (
  token: string,
  config?: AxiosRequestConfig,
) =>
  nestInstance
    .get<GetEmailCredentialResponse>('v1/credentials/email', {
      ...config,
      ...getHeaders(token),
    })
    .then((res) => ({
      data: {
        emailCredential: formatEmailCredential(res.data.emailCredential),
        walletCredential: res.data.walletCredential
          ? formatWalletCredential(res.data.walletCredential)
          : undefined,
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
