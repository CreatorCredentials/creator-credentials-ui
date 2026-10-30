import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { QueryKeys } from '@/api/queryKeys';
import {
  getAdminCredential,
  GetAdminCredentialResponse,
} from '../requests/getAdminCredential';

export const useAdminCredential = (
  credentialId: string,
  options?: Omit<
    UseQueryOptions<GetAdminCredentialResponse>,
    'queryFn' | 'queryKey'
  >,
) => {
  const auth = useAuth();

  return useQuery<GetAdminCredentialResponse>({
    queryKey: [QueryKeys.adminCredential, credentialId],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useAdminCredential call');
      }
      return getAdminCredential(credentialId, token);
    },
    ...options,
  });
};
