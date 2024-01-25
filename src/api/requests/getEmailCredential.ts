import { AxiosRequestConfig } from '../axios';
import nestInstance from '../axiosNest';

// eslint-disable-next-line
export type GetEmailCredentialResponse = any;

export const getEmailCredential = (config?: AxiosRequestConfig) =>
  nestInstance.get<GetEmailCredentialResponse>('v1/credentials', config);
