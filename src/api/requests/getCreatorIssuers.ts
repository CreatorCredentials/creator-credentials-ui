import { Issuer } from '@/shared/typings/Issuer';
import axios from '../axios';

export type GetCreatorIssuersResponse = {
  issuers: Issuer[];
};

export const getCreatorIssuers = () =>
  axios.get<GetCreatorIssuersResponse>('/creator/issuers');
