import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { removeExternalCert } from '../requests/removeExternalCert';

export const useRemoveExternalCert = (
  options?: Omit<UseMutationOptions<void, AxiosError, void>, 'mutationFn'>,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await auth.getToken();
      if (!token) throw new Error('Unauthorised useRemoveExternalCert call');
      await removeExternalCert(token);
    },
    ...options,
  });
};
