import { getHeaders } from '@/shared/utils/tokenHeader';
import nestInstance from '../axiosNest';

export type KeypairChallengeData = {
  id: number;
  publicKeyPem: string | null;
  derivedDidKey: string | null;
  challengeMessage: string | null;
  status: 'initiated' | 'challenge_issued' | 'verified' | 'consumed' | 'failed';
  currentStep: number;
  verifiedAt: string | null;
  consumedAt?: string | null;
};

export type GetKeypairChallengeStatusResponse = {
  challenge: KeypairChallengeData | null;
  externalDidKey: string | null;
  activeDidKeySource: 'platform' | 'external';
  commands: string[] | null;
};

export const getKeypairChallengeStatus = (token: string) =>
  nestInstance.get<GetKeypairChallengeStatusResponse>(
    '/v1/keypair-challenge/status',
    getHeaders(token),
  );
