import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  submitKeypairPublicKey,
  SubmitKeypairPublicKeyResponse,
} from '../requests/submitKeypairPublicKey';

export const useSubmitKeypairPublicKey = (
  options?: Omit<
    UseMutationOptions<SubmitKeypairPublicKeyResponse, AxiosError, string>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (publicKeyPem: string) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useSubmitKeypairPublicKey call');
      }
      return submitKeypairPublicKey(token, publicKeyPem).then(
        (res) => res.data,
      );
    },
    ...options,
  });
};
