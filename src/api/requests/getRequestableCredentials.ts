import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import axios, { AxiosRequestConfig } from '../axios';

export type GetRequestableCredentialsPayload = never;

export type GetRequestableCredentialsResponse = {
  credentials: VerifiedCredentialsUnion[];
};

export const getRequestableCredentials = (
  issuerId?: string,
  config?: Omit<AxiosRequestConfig, 'params'>,
) =>
  axios.get<GetRequestableCredentialsResponse>('/creator/credentials', {
    params: {
      issuerId,
    },
    ...config,
  });
