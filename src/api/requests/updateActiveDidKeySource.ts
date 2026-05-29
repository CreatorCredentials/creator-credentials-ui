import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export const updateActiveDidKeySource = (
  token: string,
  source: 'platform' | 'external',
) =>
  axios.patch(
    '/v1/keypair-challenge/active-source',
    { source },
    getHeaders(token),
  );
