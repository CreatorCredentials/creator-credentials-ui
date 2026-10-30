import axios, { AxiosResponse } from '@/api/axiosNest';
import { AdminCredential } from '@/shared/typings/Credentials';
import { getHeaders } from '@/shared/utils/tokenHeader';
import { RevokeCredentialPayload } from './revokeCredential';

type RevokeAdminCredentialBody = Pick<RevokeCredentialPayload, 'reason'>;

export type RevokeAdminCredentialResponse = AdminCredential;

export const revokeAdminCredential = (
  { credentialId, reason }: RevokeCredentialPayload,
  token: string,
) =>
  axios.post<
    RevokeAdminCredentialBody,
    AxiosResponse<RevokeAdminCredentialResponse, RevokeAdminCredentialBody>
  >(
    `/v1/admin/credentials/${credentialId}/revoke`,
    { reason },
    getHeaders(token),
  );
