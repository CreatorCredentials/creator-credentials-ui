import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { AxiosError } from '@/api/axios';
import {
  getCreatorCredentials,
  GetCreatorCredentialsResponse,
} from '../requests/getCreatorCredentials';

export const useCreatorCredentials = (
  options?: Omit<
    UseQueryOptions<GetCreatorCredentialsResponse, AxiosError>,
    'queryFn'
  >,
) =>
  useQuery({
    queryKey: [QueryKeys.creatorVerifiedCredentials],
    queryFn: () => getCreatorCredentials().then((res) => res.data),
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
