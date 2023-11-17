import { CreatorCredentials } from '@/shared/typings/Credentials';
import axios, { AxiosRequestConfig } from '../axios';

export type GetCreatorCredentialsResponse = CreatorCredentials;

export const getCreatorCredentials = (config?: AxiosRequestConfig) =>
  axios.get<GetCreatorCredentialsResponse>('/users/credentials', config);
