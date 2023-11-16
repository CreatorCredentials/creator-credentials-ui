import { IssuerProfile } from '@/shared/typings/IssuerProfile';
import axios from '../axios';

export type GetIssuerProfileResponse = IssuerProfile;

export const getIssuerProfile = () =>
  axios.get<GetIssuerProfileResponse>('/issuer/profile');
