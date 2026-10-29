import { AdminStats } from '@/shared/typings/AdminStats';
import { getHeaders } from '@/shared/utils/tokenHeader';
import axios from '../axiosNest';

export type GetAdminStatsResponse = AdminStats;

export const getAdminStats = (token: string) =>
  axios
    .get<GetAdminStatsResponse>('/v1/admin/stats', getHeaders(token))
    .then((res) => res.data);
