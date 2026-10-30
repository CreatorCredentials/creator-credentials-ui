import { AdminUser } from '@/shared/typings/AdminUser';
import { Page, PageQuery } from '@/shared/typings/Page';
import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';
import { ClerkRole } from './getUser';

export type GetAdminUsersSearchParams = PageQuery & {
  role?: ClerkRole;
};

export type GetAdminUsersResponse = Page<AdminUser>;

export const getAdminUsers = (
  params: GetAdminUsersSearchParams,
  token: string,
) =>
  axios
    .get<GetAdminUsersResponse>('/v1/admin/users', {
      params,
      ...getHeaders(token),
    })
    .then((res) => res.data);
