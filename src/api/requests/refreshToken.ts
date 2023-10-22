import { JWT } from 'next-auth/jwt';
import { BackendTokens } from '@/shared/typings/BackendTokens';
import axios, { AxiosResponse } from '@/api/axios';

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type RefreshTokenResponse = BackendTokens;

export const refreshToken = (jwt: JWT) =>
  axios.post<
    RefreshTokenPayload,
    AxiosResponse<RefreshTokenResponse, RefreshTokenPayload>
  >(
    '/auth/refresh',
    {
      refreshToken: jwt.refreshToken,
    },
    {
      headers: {
        Authorization: `Refresh ${jwt.backendTokens.refreshToken}`,
      },
    },
  );
