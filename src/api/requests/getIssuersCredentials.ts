import { getHeaders } from '@/shared/utils/tokenHeader';
import { IssuedCredential } from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import axios from '../axiosNest';

export type GetIssuersCredentialsSearchParams = {
  status: CredentialVerificationStatus;
};

export type GetIssuersCredentialsResponse = {
  credentials: IssuedCredential[];
};

export const getIssuersCredentials = (
  params: GetIssuersCredentialsSearchParams,
  token: string,
) =>
  axios.get<GetIssuersCredentialsResponse>('/v1/credentials/issuers', {
    params,
    ...getHeaders(token),
  });
