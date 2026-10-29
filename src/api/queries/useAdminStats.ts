import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { QueryKeys } from '@/api/queryKeys';
import {
  getAdminStats,
  GetAdminStatsResponse,
} from '../requests/getAdminStats';

export const useAdminStats = (
  options?: Omit<
    UseQueryOptions<GetAdminStatsResponse>,
    'queryFn' | 'queryKey'
  >,
) => {
  const auth = useAuth();

  return useQuery<GetAdminStatsResponse>({
    queryKey: [QueryKeys.adminStats],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useAdminStats call');
      }
      return getAdminStats(token);
    },
    ...options,
  });
};
