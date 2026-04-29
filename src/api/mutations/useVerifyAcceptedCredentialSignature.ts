import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  verifyAcceptedCredentialSignature,
  VerifyAcceptedCredentialSignaturePayload,
} from '../requests/acceptCredentialsIssuanceRequest';

export const useVerifyAcceptedCredentialSignature = (
  options?: Omit<
    UseMutationOptions<never, AxiosError, VerifyAcceptedCredentialSignaturePayload>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: VerifyAcceptedCredentialSignaturePayload) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useVerifyAcceptedCredentialSignature call');
      }
      return verifyAcceptedCredentialSignature(payload, token).then(
        (res) => res.data,
      );
    },
    ...options,
  });
};
