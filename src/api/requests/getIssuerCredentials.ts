import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import axios from '../axios';

export type GetIssuerCredentialsResponse = {
  credentials: VerifiedCredentialsUnion[];
};

export const getIssuerCredentials = () =>
  axios.get<GetIssuerCredentialsResponse>('/issuer/credentials');
