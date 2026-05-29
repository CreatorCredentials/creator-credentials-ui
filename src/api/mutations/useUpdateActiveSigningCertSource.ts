import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { updateActiveSigningCertSource } from '../requests/updateActiveSigningCertSource';

export const useUpdateActiveSigningCertSource = (
  options?: Omit<
    UseMutationOptions<void, AxiosError, 'platform' | 'external'>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (source: 'platform' | 'external') => {
      const token = await auth.getToken();
      if (!token)
        throw new Error('Unauthorised useUpdateActiveSigningCertSource call');
      await updateActiveSigningCertSource(token, source);
    },
    ...options,
  });
};
