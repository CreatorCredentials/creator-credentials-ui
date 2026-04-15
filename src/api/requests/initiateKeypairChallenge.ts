import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';
import { KeypairChallengeData } from './getKeypairChallengeStatus';

export type InitiateKeypairChallengeResponse = {
  challenge: KeypairChallengeData;
  commands: string[];
};

export const initiateKeypairChallenge = (token: string) =>
  axios.post<never, AxiosResponse<InitiateKeypairChallengeResponse>>(
    '/v1/keypair-challenge/initiate',
    {},
    getHeaders(token),
  );
