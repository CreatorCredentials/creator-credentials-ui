import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export const updateActiveSigningCertSource = (
  token: string,
  source: 'platform' | 'external',
) =>
  axios.patch(
    '/v1/cert-challenge/active-source',
    { source },
    getHeaders(token),
  );
