import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';

export type VerifyCertSignaturePayload = { signature: string };
export type VerifyCertSignatureResponse = {
  verified: boolean;
  error?: string;
};

export const verifyCertSignature = (token: string, signature: string) =>
  axios.post<VerifyCertSignaturePayload, AxiosResponse<VerifyCertSignatureResponse>>(
    '/v1/cert-challenge/verify-signature',
    { signature },
    getHeaders(token),
  );
