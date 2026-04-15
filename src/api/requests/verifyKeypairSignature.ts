import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';

export type VerifyKeypairSignaturePayload = { signature: string };
export type VerifyKeypairSignatureResponse = {
  verified: boolean;
  didKey?: string;
  error?: string;
};

export const verifyKeypairSignature = (token: string, signature: string) =>
  axios.post<
    VerifyKeypairSignaturePayload,
    AxiosResponse<VerifyKeypairSignatureResponse>
  >('/v1/keypair-challenge/verify-signature', { signature }, getHeaders(token));
