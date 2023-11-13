import { CredentialType } from '@/shared/typings/CredentialType';
import { IssuerWithVerifiedCredentials } from '@/shared/typings/Issuer';
import axios, { AxiosRequestConfig } from '../axios';

export type GetIssuersBySelectedCredentialsPayload = {
  credentials: CredentialType[];
};

export type GetIssuersBySelectedCredentialsResponse = {
  issuers: IssuerWithVerifiedCredentials[];
};

export const getIssuersBySelectedCredentials = (
  payload: GetIssuersBySelectedCredentialsPayload,
  config?: Omit<AxiosRequestConfig, 'data'>,
) =>
  axios.get<GetIssuersBySelectedCredentialsResponse>(
    '/creator/credentials/issuers',
    {
      data: payload,
      ...config,
    },
  );
