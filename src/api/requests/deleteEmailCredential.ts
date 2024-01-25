import { AxiosRequestConfig } from '../axios';
import nestInstance from '../axiosNest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeleteEmailCredentialResponse = any;

export const deleteEmailCredential = (config?: AxiosRequestConfig) =>
  nestInstance.delete<DeleteEmailCredentialResponse>('v1/credentials', config);
