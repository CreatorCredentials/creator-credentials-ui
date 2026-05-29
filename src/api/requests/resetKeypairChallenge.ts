import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export const resetKeypairChallenge = (token: string) =>
  axios.post('/v1/keypair-challenge/reset', {}, getHeaders(token));
