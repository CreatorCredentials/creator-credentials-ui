import axios, { AxiosResponse } from '../axios';

export type DisconnectMetaMaskWalletPayload = never;

export type DisconnectMetaMaskWalletResponse = never;

export const disconnectMetaMaskWallet = (walletAddress: string) =>
  axios.post<
    DisconnectMetaMaskWalletPayload,
    AxiosResponse<
      DisconnectMetaMaskWalletResponse,
      DisconnectMetaMaskWalletPayload
    >
  >(`/users/${walletAddress}`);
