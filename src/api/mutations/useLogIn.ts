import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from '@/api/axios';
import { logIn, LoginPayload, LoginResponse } from '../requests/logIn';

export const useLogIn = (
  options?: Omit<
    UseMutationOptions<LoginResponse, AxiosError, LoginPayload>,
    'mutationFn'
  >,
) =>
  useMutation({
    mutationFn: (payload: LoginPayload) =>
      logIn(payload).then((res) => res.data),
    ...options,
  });
