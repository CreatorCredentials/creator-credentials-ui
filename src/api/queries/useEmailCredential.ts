import { UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { AxiosError, AxiosRequestConfig } from '@/api/axios';
import { useAuthQuery } from '@/api/helpers/useAuthQuery';
import { EmailCredential } from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialType } from '@/shared/typings/CredentialType';
import {
  getEmailCredential,
  GetEmailCredentialResponse,
} from '../requests/getEmailCredential';

export const useEmailCredential = (
  options?: Omit<
    UseQueryOptions<GetEmailCredentialResponse, AxiosError>,
    'queryFn'
  >,
) =>
  useAuthQuery({
    queryKey: [QueryKeys.creatorEmailCredential],
    queryFn: (config?: AxiosRequestConfig) =>
      getEmailCredential({ ...config }).then((res) =>
        emailCredentialsFormatter(res.data),
      ),
    ...options,
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function emailCredentialsFormatter(credentials: any[]): EmailCredential[] {
  return credentials.map(formatEmailCredential);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatEmailCredential(credential: any): EmailCredential {
  return {
    id: credential.id,
    status: CredentialVerificationStatus.Success,
    type: CredentialType.Email,
    data: {
      address: credential.credentialSubject.email || 'wrong',
      companyName: 'Creator Credentials B.V.',
      requirements: 'Info about requirements',
      credentialsObject: credential,
    },
  } as EmailCredential;
}
