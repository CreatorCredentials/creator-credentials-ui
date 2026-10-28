import axios, { AxiosResponse } from '@/api/axiosNest';
import { IssuedCredential } from '@/shared/typings/Credentials';
import { getHeaders } from '@/shared/utils/tokenHeader';

export type RevokeCredentialPayload = {
  credentialId: string;
  reason?: string;
};

type RevokeCredentialBody = Pick<RevokeCredentialPayload, 'reason'>;

export type RevokeCredentialResponse = IssuedCredential;

export const revokeCredential = (
  { credentialId, reason }: RevokeCredentialPayload,
  token: string,
) =>
  axios.post<
    RevokeCredentialBody,
    AxiosResponse<RevokeCredentialResponse, RevokeCredentialBody>
  >(`/v1/credentials/${credentialId}/revoke`, { reason }, getHeaders(token));
