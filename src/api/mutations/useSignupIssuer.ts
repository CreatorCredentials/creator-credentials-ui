import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from '@/api/axios';
import {
  signupIssuer,
  SignupIssuerPayload,
  SignupIssuerResponse,
} from '../requests/signupIssuer';

export const useSignupIssuer = (
  options?: Omit<
    UseMutationOptions<SignupIssuerResponse, AxiosError, SignupIssuerPayload>,
    'mutationFn'
  >,
) =>
  useMutation({
    mutationFn: (payload: SignupIssuerPayload) =>
      signupIssuer(payload).then((res) => res.data),
    ...options,
  });
