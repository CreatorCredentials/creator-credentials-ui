import axios, { AxiosResponse } from '@/api/axios';
import { CredentialType } from '@/shared/typings/CredentialType';

export type SendCredentialsRequestPayload = {
  credentials: CredentialType[];
  issuerId: string;
};

export type SendCredentialsRequestResponse = never;

export const sendCredentialsRequest = (
  payload: SendCredentialsRequestPayload,
) =>
  axios.post<
    SendCredentialsRequestPayload,
    AxiosResponse<SendCredentialsRequestResponse, SendCredentialsRequestPayload>
  >(`/creator/credentials/request`, payload);
