import { UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { AxiosError, AxiosRequestConfig } from '@/api/axios';
import { useAuthQuery } from '@/api/helpers/useAuthQuery';
import {
  deleteEmailCredential,
  DeleteEmailCredentialResponse,
} from '../requests/deleteEmailCredential';

export const useDeleteEmailCredential = (
  options?: Omit<
    UseQueryOptions<DeleteEmailCredentialResponse, AxiosError>,
    'queryFn'
  >,
) =>
  useAuthQuery({
    queryKey: [QueryKeys.creatorEmailCredential],
    queryFn: (config?: AxiosRequestConfig) =>
      deleteEmailCredential({ ...config }).then((res) => res.data),
    ...options,
  });
