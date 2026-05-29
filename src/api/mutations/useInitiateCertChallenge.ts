import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  initiateCertChallenge,
  InitiateCertChallengeResponse,
} from '../requests/initiateCertChallenge';

export const useInitiateCertChallenge = (
  options?: Omit<
    UseMutationOptions<InitiateCertChallengeResponse, AxiosError, void>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await auth.getToken();
      if (!token) throw new Error('Unauthorised useInitiateCertChallenge call');
      return initiateCertChallenge(token).then((res) => res.data);
    },
    ...options,
  });
};
