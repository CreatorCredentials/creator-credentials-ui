import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';
import { KeypairChallengeData } from './getKeypairChallengeStatus';

export type SubmitKeypairPublicKeyPayload = { publicKeyPem: string };
export type SubmitKeypairPublicKeyResponse = {
  challenge: KeypairChallengeData;
  commands: string[];
};

export const submitKeypairPublicKey = (token: string, publicKeyPem: string) =>
  axios.post<
    SubmitKeypairPublicKeyPayload,
    AxiosResponse<SubmitKeypairPublicKeyResponse>
  >(
    '/v1/keypair-challenge/submit-public-key',
    { publicKeyPem },
    getHeaders(token),
  );
