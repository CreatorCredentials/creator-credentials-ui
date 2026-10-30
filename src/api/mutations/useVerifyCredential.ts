import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from '@/api/axiosNest';
import { VerifyCredentialPayload } from '@/shared/typings/CredentialVerification';
import {
  verifyCredential,
  VerifyCredentialResponse,
} from '../requests/verifyCredential';

type VerifyCredentialMutationOptions = Omit<
  UseMutationOptions<
    VerifyCredentialResponse,
    AxiosError,
    VerifyCredentialPayload
  >,
  'mutationFn'
>;

/** Verification is stateless on the backend, so it is modelled as a mutation triggered by the user. */
export const useVerifyCredential = (
  options?: VerifyCredentialMutationOptions,
) =>
  useMutation({
    mutationFn: verifyCredential,
    ...options,
  });
