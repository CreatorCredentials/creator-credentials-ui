import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import {
  connectLicciumDidKey,
  ConnectLicciumDidKeyProps,
  ConnectLicciumDidKeyResponse,
} from '../requests/connectLicciumDidKey';

export const useConnectLicciumDidKey = (
  options?: Omit<
    UseMutationOptions<
      ConnectLicciumDidKeyResponse,
      AxiosError,
      ConnectLicciumDidKeyProps
    >,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (props: ConnectLicciumDidKeyProps) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useConnectLicciumDidKey call');
      }

      return connectLicciumDidKey(token, props).then((res) => res.data);
    },
    ...options,
  });
};
