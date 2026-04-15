import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { updateActiveDidKeySource } from '../requests/updateActiveDidKeySource';

export const useUpdateActiveDidKeySource = (
  options?: Omit<
    UseMutationOptions<void, AxiosError, 'platform' | 'external'>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (source: 'platform' | 'external') => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useUpdateActiveDidKeySource call');
      }
      await updateActiveDidKeySource(token, source);
    },
    ...options,
  });
};
