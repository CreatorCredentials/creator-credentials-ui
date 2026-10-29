import {
  CredentialVerificationResult,
  VerifyCredentialPayload,
} from '@/shared/typings/CredentialVerification';
import axios from '../axiosNest';

export type VerifyCredentialResponse = CredentialVerificationResult;

/** Public endpoint: no bearer token. */
export const verifyCredential = (payload: VerifyCredentialPayload) =>
  axios
    .post<VerifyCredentialResponse>('/v1/credentials/verify', payload)
    .then((res) => res.data);
