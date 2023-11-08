import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { AxiosError } from '@/api/axios';
import {
  getCreatorVerifiedCredentials,
  GetCreatorVerifiedCredentialsResponse,
} from '../requests/getCreatorVerifiedCredentials';

export const useCreatorVerifiedCredentials = (
  options?: Omit<
    UseQueryOptions<GetCreatorVerifiedCredentialsResponse, AxiosError>,
    'queryFn'
  >,
) =>
  useQuery({
    queryKey: [QueryKeys.creatorVerifiedCredentials],
    queryFn: () => getCreatorVerifiedCredentials().then((res) => res.data),
    ...options,
  });
