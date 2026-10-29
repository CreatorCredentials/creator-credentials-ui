import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { QueryKeys } from '@/api/queryKeys';
import {
  revokeAdminCredential,
  RevokeAdminCredentialResponse,
} from '../requests/revokeAdminCredential';
import { RevokeCredentialPayload } from '../requests/revokeCredential';

type AdminRevokeCredentialMutationOptions = Omit<
  UseMutationOptions<
    RevokeAdminCredentialResponse,
    AxiosError,
    RevokeCredentialPayload
  >,
  'mutationFn'
>;

export const useAdminRevokeCredential = (
  options?: AdminRevokeCredentialMutationOptions,
) => {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ credentialId, reason }: RevokeCredentialPayload) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useAdminRevokeCredential call');
      }
      return revokeAdminCredential({ credentialId, reason }, token).then(
        (res) => res.data,
      );
    },
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.adminCredentials],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.adminCredential, variables.credentialId],
        }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.adminStats] }),
      ]);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
