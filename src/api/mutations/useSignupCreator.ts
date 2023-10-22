import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from '@/api/axios';
import {
  signupCreator,
  SignupCreatorPayload,
  SignupCreatorResponse,
} from '../requests/signupCreator';

export const useSignupCreator = (
  options?: Omit<
    UseMutationOptions<SignupCreatorResponse, AxiosError, SignupCreatorPayload>,
    'mutationFn'
  >,
) =>
  useMutation({
    mutationFn: (payload: SignupCreatorPayload) =>
      signupCreator(payload).then((res) => res.data),
    ...options,
  });
