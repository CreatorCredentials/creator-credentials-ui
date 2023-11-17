import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { Creator } from '@/shared/typings/Creator';
import axios from '../axios';

export type GetCredentialsRequestDetailsResponse = {
  creator: Creator;
  credentials: VerifiedCredentialsUnion[];
};

export const getCredentialsRequestDetails = (creatorId: string) =>
  axios.get<GetCredentialsRequestDetailsResponse>(
    `/issuer/creators/${creatorId}`,
  );
