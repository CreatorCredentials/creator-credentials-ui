import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { QueryKeys } from '@/api/queryKeys';
import {
  getAdminCredentials,
  GetAdminCredentialsResponse,
  GetAdminCredentialsSearchParams,
} from '../requests/getAdminCredentials';

export const useAdminCredentials = (
  params: GetAdminCredentialsSearchParams,
  options?: Omit<
    UseQueryOptions<GetAdminCredentialsResponse>,
    'queryFn' | 'queryKey'
  >,
) => {
  const auth = useAuth();

  return useQuery<GetAdminCredentialsResponse>({
    queryKey: [QueryKeys.adminCredentials, params],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useAdminCredentials call');
      }
      return getAdminCredentials(params, token);
    },
    ...options,
  });
};
