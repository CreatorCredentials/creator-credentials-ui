import { IssuerWithVerifiedCredentials } from '@/shared/typings/Issuer';
import axios from '../axios';

export type GetIssuerDetailsWithCredentialsPayload = {
  issuerId: string;
};

export type GetIssuerDetailsWithCredentialsResponse = {
  issuer: IssuerWithVerifiedCredentials;
};

export const getIssuerDetailsWithCredentials = ({
  issuerId,
}: GetIssuerDetailsWithCredentialsPayload) =>
  axios.get<GetIssuerDetailsWithCredentialsResponse>(
    `/creator/issuers/${issuerId}`,
  );
