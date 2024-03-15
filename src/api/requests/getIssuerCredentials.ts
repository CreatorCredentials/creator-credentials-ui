import {
  DidWebCredential,
  IssuerCredentials,
} from '@/shared/typings/Credentials';
import {
  DomainCredential,
  EmailCredential,
} from '@/shared/typings/Credentials';
import { getHeaders } from '@/shared/utils/tokenHeader';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialType } from '@/shared/typings/CredentialType';
import axios, { AxiosRequestConfig } from '../axiosNest';

export type GetIssuerCredentialsResponse = IssuerCredentials;

export const getIssuerCredentials = (
  token: string,
  config?: AxiosRequestConfig,
) =>
  axios
    .get<GetIssuerCredentialsResponse>('/v1/users/credentials', {
      ...config,
      ...getHeaders(token),
    })
    .then((res) => ({
      data: {
        email: formatEmailCredential(res.data.email),
        domain: res.data.domain
          ? formatDomainCredential(res.data.domain)
          : null,
        didWeb: res.data.didWeb
          ? formatDidWebCredential(res.data.didWeb)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatDidWebCredential(credential: any): DidWebCredential {
  return {
    id: credential.id,
    status: credential.status,
    type: CredentialType.DidWeb,
    data: {
      domain: credential.domain || 'wrong',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
      credentialObject: credential,
    },
  };
}
