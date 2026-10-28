import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { QueryKeys } from '@/api/queryKeys';
import {
  revokeCredential,
  RevokeCredentialPayload,
  RevokeCredentialResponse,
} from '../requests/revokeCredential';

type RevokeCredentialMutationOptions = Omit<
  UseMutationOptions<
    RevokeCredentialResponse,
    AxiosError,
    RevokeCredentialPayload
  >,
  'mutationFn'
>;

export const useRevokeCredential = (
  options?: RevokeCredentialMutationOptions,
) => {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ credentialId, reason }: RevokeCredentialPayload) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useRevokeCredential call');
      }
      return revokeCredential({ credentialId, reason }, token).then(
        (res) => res.data,
      );
    },
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.issuersCredentials],
        }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.issuerCreators] }),
      ]);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
