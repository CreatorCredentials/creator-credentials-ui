import { AdminCredential } from '@/shared/typings/Credentials';
import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export type GetAdminCredentialResponse = AdminCredential;

export const getAdminCredential = (credentialId: string, token: string) =>
  axios
    .get<GetAdminCredentialResponse>(
      `/v1/admin/credentials/${credentialId}`,
      getHeaders(token),
    )
    .then((res) => res.data);
