import { VerifiedCredential } from '@/shared/typings/VerifiedCredential';
import axios, { AxiosRequestConfig } from '../axios';

export type GetCreatorVerifiedCredentialsResponse = {
  metaMask: VerifiedCredential | null;
  email: VerifiedCredential;
  domain: VerifiedCredential | null;
};

export const getCreatorVerifiedCredentials = (config?: AxiosRequestConfig) =>
  axios.get<GetCreatorVerifiedCredentialsResponse>('/users/vc', config);
