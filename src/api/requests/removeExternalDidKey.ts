import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export const removeExternalDidKey = (token: string) =>
  axios.delete('/v1/keypair-challenge/external-key', getHeaders(token));
