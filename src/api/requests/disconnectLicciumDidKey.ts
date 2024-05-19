import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';

export type DisconnectLicciumDidKeyPayload = never;

export type DisconnectLicciumDidKeyResponse = never;

export const disconnectLicciumDidKey = (token: string) =>
  axios.post<
    DisconnectLicciumDidKeyPayload,
    AxiosResponse<
      DisconnectLicciumDidKeyResponse,
      DisconnectLicciumDidKeyPayload
    >
  >(`/v1/users/did-liccium/disconnect`, {}, getHeaders(token));
