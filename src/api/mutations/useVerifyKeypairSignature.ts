import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  verifyKeypairSignature,
  VerifyKeypairSignatureResponse,
} from '../requests/verifyKeypairSignature';

export const useVerifyKeypairSignature = (
  options?: Omit<
    UseMutationOptions<VerifyKeypairSignatureResponse, AxiosError, string>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (signature: string) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useVerifyKeypairSignature call');
      }
      return verifyKeypairSignature(token, signature).then((res) => res.data);
    },
    ...options,
  });
};
