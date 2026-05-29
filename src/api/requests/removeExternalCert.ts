import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export const removeExternalCert = (token: string) =>
  axios.delete('/v1/cert-challenge/external-cert', getHeaders(token));
