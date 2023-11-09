import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import axios, { AxiosRequestConfig } from '../axios';

export type GetCreatorVerifiedCredentialsResponse = {
  metaMask: string | null;
  email: string;
  domain: {
    value: string | null;
    status: CredentialVerificationStatus;
  };
};

export const getCreatorVerifiedCredentials = (config?: AxiosRequestConfig) =>
  axios.get<GetCreatorVerifiedCredentialsResponse>('/users/vc', config);
