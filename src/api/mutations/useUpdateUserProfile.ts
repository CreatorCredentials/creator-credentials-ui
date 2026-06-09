import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { AxiosError } from '@/api/axiosNest';
import { IssuerProfile } from '@/shared/typings/IssuerProfile';
import {
  updateUserProfile,
  UpdateUserProfilePayload,
} from '../requests/updateUserProfile';

export const useUpdateUserProfile = (
  options?: Omit<
    UseMutationOptions<IssuerProfile, AxiosError, UpdateUserProfilePayload>,
    'mutationFn'
  >,
) => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: UpdateUserProfilePayload) => {
      const token = await auth.getToken();
      if (!token) {
        throw new Error('Unauthorised useUpdateUserProfile call');
      }
      return updateUserProfile(token, payload).then((res) => res.data);
    },
    ...options,
  });
};
