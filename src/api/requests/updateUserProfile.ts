import { IssuerProfile } from '@/shared/typings/IssuerProfile';
import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';

export type UpdateUserProfilePayload = {
  description?: string;
  domain?: string;
};

export const updateUserProfile = (
  token: string,
  payload: UpdateUserProfilePayload,
) =>
  axios.patch<never, AxiosResponse<IssuerProfile>>(
    '/v1/users/profile',
    payload,
    getHeaders(token),
  );
