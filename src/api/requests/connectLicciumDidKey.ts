import { getHeaders } from '@/shared/utils/tokenHeader';
import axios, { AxiosResponse } from '../axiosNest';

export type ConnectLicciumDidKeyPayload = {
  licciumDidKey: string;
};

export type ConnectLicciumDidKeyResponse = never;

export type ConnectLicciumDidKeyProps = {
  payload: ConnectLicciumDidKeyPayload;
};

export const connectLicciumDidKey = (
  token: string,
  { payload }: ConnectLicciumDidKeyProps,
) =>
  axios.post<
    ConnectLicciumDidKeyPayload,
    AxiosResponse<ConnectLicciumDidKeyResponse, ConnectLicciumDidKeyPayload>
  >(`/v1/users/did-liccium/connect`, payload, getHeaders(token));
