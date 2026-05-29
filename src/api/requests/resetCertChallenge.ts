import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export const resetCertChallenge = (token: string) =>
  axios.post('/v1/cert-challenge/reset', {}, getHeaders(token));
