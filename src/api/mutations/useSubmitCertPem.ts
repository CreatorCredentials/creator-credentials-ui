import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { submitCertPem, SubmitCertPemResponse } from '../requests/submitCertPem';

export const useSubmitCertPem = (
  options?: Omit<
    UseMutationOptions<SubmitCertPemResponse, AxiosError, string>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (certPem: string) => {
      const token = await auth.getToken();
      if (!token) throw new Error('Unauthorised useSubmitCertPem call');
      return submitCertPem(token, certPem).then((res) => res.data);
    },
    ...options,
  });
};
