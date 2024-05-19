import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  disconnectLicciumDidKey,
  DisconnectLicciumDidKeyResponse,
} from '../requests/disconnectLicciumDidKey';

export const useDisconnecLicciumDidKey = (
  options?: Omit<
    UseMutationOptions<DisconnectLicciumDidKeyResponse, AxiosError, string>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useDisconnecLicciumDidKey call');
      }

      return disconnectLicciumDidKey(token).then((res) => res.data);
    },
    ...options,
  });
};
