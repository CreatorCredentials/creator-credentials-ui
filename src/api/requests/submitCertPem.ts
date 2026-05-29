import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';
import { CertChallengeData } from './getCertChallengeStatus';

export type SubmitCertPemPayload = { certPem: string };
export type SubmitCertPemResponse = {
  challenge: CertChallengeData;
  commands: string[];
};

export const submitCertPem = (token: string, certPem: string) =>
  axios.post<SubmitCertPemPayload, AxiosResponse<SubmitCertPemResponse>>(
    '/v1/cert-challenge/submit-cert',
    { certPem },
    getHeaders(token),
  );
