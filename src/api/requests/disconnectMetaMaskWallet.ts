import axios, { AxiosResponse } from '../axiosNest';

export type DisconnectMetaMaskWalletPayload = never;

export type DisconnectMetaMaskWalletResponse = never;

export const disconnectMetaMaskWallet = (token: string) =>
  axios.post<
    DisconnectMetaMaskWalletPayload,
    AxiosResponse<
      DisconnectMetaMaskWalletResponse,
      DisconnectMetaMaskWalletPayload
    >
  >(
    `/v1/users/address/disconnect`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
