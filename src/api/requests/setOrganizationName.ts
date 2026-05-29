import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';
import { User } from './getUser';

export const setOrganizationName = (token: string, organizationName: string) =>
  axios.post<never, AxiosResponse<User>>(
    '/v1/users/organization-name',
    { organizationName },
    getHeaders(token),
  );
