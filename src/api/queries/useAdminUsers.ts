import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { QueryKeys } from '@/api/queryKeys';
import {
  getAdminUsers,
  GetAdminUsersResponse,
  GetAdminUsersSearchParams,
} from '../requests/getAdminUsers';

export const useAdminUsers = (
  params: GetAdminUsersSearchParams,
  options?: Omit<
    UseQueryOptions<GetAdminUsersResponse>,
    'queryFn' | 'queryKey'
  >,
) => {
  const auth = useAuth();

  return useQuery<GetAdminUsersResponse>({
    queryKey: [QueryKeys.adminUsers, params],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useAdminUsers call');
      }
      return getAdminUsers(params, token);
    },
    ...options,
  });
};
