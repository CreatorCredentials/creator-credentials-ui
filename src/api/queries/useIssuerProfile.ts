import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { QueryKeys } from '@/api/queryKeys';
import {
  getIssuerProfile,
  GetIssuerProfileResponse,
} from '../requests/getIssuerProfile';

export const useIssuerProfile = (
  options?: Omit<
    UseQueryOptions<GetIssuerProfileResponse, AxiosError>,
    'queryFn' | 'queryKey'
  >,
) => {
  const auth = useAuth();

  return useQuery<GetIssuerProfileResponse, AxiosError>(
    [QueryKeys.issuerProfile],
    async () => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useIssuerProfile call');
      }
      return getIssuerProfile(token).then((res) => res.data);
    },
    options,
  );
};
