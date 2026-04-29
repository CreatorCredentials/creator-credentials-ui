import { getHeaders } from '@/shared/utils/tokenHeader';
import nestInstance from '../axiosNest';

export type CertChallengeData = {
  id: number;
  certPem: string | null;
  challengeMessage: string | null;
  status: 'initiated' | 'challenge_issued' | 'verified' | 'failed';
  currentStep: number;
  verifiedAt: string | null;
};

export type GetCertChallengeStatusResponse = {
  challenge: CertChallengeData | null;
  externalCertPem: string | null;
  activeSigningCertSource: 'platform' | 'external';
  commands: string[] | null;
};

export const getCertChallengeStatus = (token: string) =>
  nestInstance.get<GetCertChallengeStatusResponse>(
    '/v1/cert-challenge/status',
    getHeaders(token),
  );
