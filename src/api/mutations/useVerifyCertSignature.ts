import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  verifyCertSignature,
  VerifyCertSignatureResponse,
} from '../requests/verifyCertSignature';

export const useVerifyCertSignature = (
  options?: Omit<
    UseMutationOptions<VerifyCertSignatureResponse, AxiosError, string>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (signature: string) => {
      const token = await auth.getToken();
      if (!token) throw new Error('Unauthorised useVerifyCertSignature call');
      return verifyCertSignature(token, signature).then((res) => res.data);
    },
    ...options,
  });
};
