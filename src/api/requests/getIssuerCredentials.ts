import { IssuerCredentials } from '@/shared/typings/Credentials';
import axios from '../axios';

export type GetIssuerCredentialsResponse = {
  credentials: IssuerCredentials;
};

export const getIssuerCredentials = () =>
  axios.get<GetIssuerCredentialsResponse>('/issuer/credentials');
