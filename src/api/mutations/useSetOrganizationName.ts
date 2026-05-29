import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { setOrganizationName } from '../requests/setOrganizationName';
import { User } from '../requests/getUser';

export const useSetOrganizationName = (
  options?: Omit<UseMutationOptions<User, AxiosError, string>, 'mutationFn'>,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (organizationName: string) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useSetOrganizationName call');
      }
      return setOrganizationName(token, organizationName).then(
        (res) => res.data,
      );
    },
    ...options,
  });
};
