import { AdminCredential } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { Page, PageQuery } from '@/shared/typings/Page';
import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export type GetAdminCredentialsSearchParams = PageQuery & {
  status?: CredentialVerificationStatus;
  type?: CredentialType;
  issuerId?: number;
};

export type GetAdminCredentialsResponse = Page<AdminCredential>;

export const getAdminCredentials = (
  params: GetAdminCredentialsSearchParams,
  token: string,
) =>
  axios
    .get<GetAdminCredentialsResponse>('/v1/admin/credentials', {
      params,
      ...getHeaders(token),
    })
    .then((res) => res.data);
