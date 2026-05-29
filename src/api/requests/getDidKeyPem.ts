import { getHeaders } from '@/shared/utils/tokenHeader';
import nestInstance from '../axiosNest';

export type GetDidKeyPemResponse = {
  publicKeyPem: string;
};

export const getDidKeyPem = (token: string, did: string) =>
  nestInstance.get<GetDidKeyPemResponse>('/v1/keypair-challenge/did-key-pem', {
    ...getHeaders(token),
    params: { did },
  });
