import axios, { AxiosResponse } from '@/api/axiosNest';
import { CredentialType } from '@/shared/typings/CredentialType';
import { getHeaders } from '@/shared/utils/tokenHeader';

export type SendCredentialsRequestPayload = {
  credentials: CredentialType[];
  issuerId: string;
};

export type SendCredentialsRequestResponse = never;

export const sendCredentialsRequest = (
  payload: SendCredentialsRequestPayload,
  token: string,
) =>
  axios.post<
    SendCredentialsRequestPayload,
    AxiosResponse<SendCredentialsRequestResponse, SendCredentialsRequestPayload>
  >(`/v1/credentials/request`, payload, getHeaders(token));
