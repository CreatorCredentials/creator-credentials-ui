import axios, { AxiosResponse } from '../axios';

export type ConnectMetaMaskWalletPayload = {
  signedMessage: string;
};

export type ConnectMetaMaskWalletResponse = never;

export type ConnectMetaMaskWalletProps = {
  walletAddress: string;
  payload: ConnectMetaMaskWalletPayload;
};

export const connectMetaMaskWallet = ({
  walletAddress,
  payload,
}: ConnectMetaMaskWalletProps) =>
  axios.post<
    ConnectMetaMaskWalletPayload,
    AxiosResponse<ConnectMetaMaskWalletResponse, ConnectMetaMaskWalletPayload>
  >(`/users/${walletAddress}`, payload);
