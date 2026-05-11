import axios, { AxiosResponse } from '@/api/axiosNest';
import { VerifiedCredentialsTemplate } from '@/shared/typings/Templates';
import { getHeaders } from '@/shared/utils/tokenHeader';
import { CredentialType } from '@/shared/typings/CredentialType';

export type SendCredentialsRequestPayload = {
  templates: Omit<VerifiedCredentialsTemplate, 'id'>[];
  issuerId: string;
  credentialType: CredentialType.Member | CredentialType.DataSupplier;
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
