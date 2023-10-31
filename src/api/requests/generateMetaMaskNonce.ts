import axios, { AxiosResponse } from '../axios';

export type GenerateMetaMaskNoncePayload = {
  address: string;
};

export type GenerateMetaMaskNonceResponse = {
  nonce: string;
};

export const generateMetaMaskNonce = (payload: GenerateMetaMaskNoncePayload) =>
  axios.post<
    GenerateMetaMaskNoncePayload,
    AxiosResponse<GenerateMetaMaskNonceResponse, GenerateMetaMaskNoncePayload>
  >('/users/nonce', payload);
