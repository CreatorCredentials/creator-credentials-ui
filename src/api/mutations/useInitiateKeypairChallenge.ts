import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  initiateKeypairChallenge,
  InitiateKeypairChallengeResponse,
} from '../requests/initiateKeypairChallenge';

export const useInitiateKeypairChallenge = (
  options?: Omit<
    UseMutationOptions<
      InitiateKeypairChallengeResponse,
      AxiosError,
      string | undefined
    >,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (keyFilePrefix?: string) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useInitiateKeypairChallenge call');
      }
      return initiateKeypairChallenge(token, keyFilePrefix).then(
        (res) => res.data,
      );
    },
    ...options,
  });
};
