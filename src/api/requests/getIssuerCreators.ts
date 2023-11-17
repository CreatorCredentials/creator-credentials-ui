import { Creator } from '@/shared/typings/Creator';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
import axios from '../axios';

export type GetIssuerCreatorsSearchParams = {
  search: string;
  status: CreatorVerificationStatus;
};

export type GetIssuerCreatorsResponse = {
  creators: Creator[];
};

export const getIssuerCreators = (params: GetIssuerCreatorsSearchParams) =>
  axios.get<GetIssuerCreatorsResponse>('/issuer/creators', {
    params,
  });
