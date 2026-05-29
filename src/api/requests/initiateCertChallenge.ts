import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';
import { CertChallengeData } from './getCertChallengeStatus';

export type InitiateCertChallengeResponse = {
  challenge: CertChallengeData;
};

export const initiateCertChallenge = (token: string) =>
  axios.post<never, AxiosResponse<InitiateCertChallengeResponse>>(
    '/v1/cert-challenge/initiate',
    {},
    getHeaders(token),
  );
