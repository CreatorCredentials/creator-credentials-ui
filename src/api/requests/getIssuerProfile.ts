import { IssuerProfile } from '@/shared/typings/IssuerProfile';
import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export type GetIssuerProfileResponse = IssuerProfile;

export const getIssuerProfile = (token: string) =>
  axios.get<GetIssuerProfileResponse>('/v1/users/profile', getHeaders(token));
