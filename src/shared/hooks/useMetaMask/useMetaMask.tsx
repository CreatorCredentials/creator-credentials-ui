import { useSDK } from '@metamask/sdk-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useToast } from '@/shared/hooks/useToast';
import { useConnectMetaMaskWallet } from '@/api/mutations/useConnectMetaMaskWallet';
import { useDisconnectMetaMaskWallet } from '@/api/mutations/useDisconnectMetaMaskWallet';
import { useGenerateMetaMaskNonce } from '@/api/mutations/useGenerateMetaMaskNonce';
import { QueryKeys } from '@/api/queryKeys';
import { ProviderRpcError } from '@/shared/typings/ProviderRpcError';
import { config } from '@/shared/constants/config';

type UseMetaMaskProps = {
  optimisticUpdate?: boolean;
};

export const useMetaMask = ({
  optimisticUpdate = true,
}: UseMetaMaskProps = {}) => {
  const { t } = useTranslation('metamask');
  const queryClient = useQueryClient();
  const toast = useToast();
  const { sdk, ready, provider, connecting, account } = useSDK();
  const [isWaitingForSignature, setIsWaitingForSignature] = useState(false);

  const {
    mutateAsync: mutateConnectWallet,
    isLoading: isConnectingMutationRunning,
  } = useConnectMetaMaskWallet({
    onSuccess: () => {
      if (!optimisticUpdate) return;

      queryClient.setQueryData([QueryKeys.creatorVerifiedCredentials], {
        metaMask: account,
      });
    },
  });

  const { mutateAsync: mutateDisconnectWallet, isLoading: isDisconnecting } =
    useDisconnectMetaMaskWallet({
      onSuccess: () => {
        if (!optimisticUpdate) return;

        queryClient.setQueryData([QueryKeys.creatorVerifiedCredentials], {
          metaMask: null,
        });
      },
    });

  const { mutateAsync: mutateMetaMaskNonce, isLoading: isLoadingNonce } =
    useGenerateMetaMaskNonce();

  const connect = async () => {
    try {
      if (!sdk || !provider || !ready) {
        throw new Error('SDK not ready');
      }

      const wallets = (await sdk.connect()) as string[] | undefined;

      if (!wallets?.[0]) {
        throw new Error('No connection with wallet');
      }

      const from = wallets[0];
      const { nonce } = await mutateMetaMaskNonce({ address: from });
      setIsWaitingForSignature(true);

      const signature = await provider.request<string>({
        method: 'personal_sign',
        params: [
          t('sign-message', {
            nonce,
            walletAddress: from,
            termsAndConditionsUrl: config.TERMS_AND_CONDITIONS_URL,
          }),
          from,
        ],
      });

      if (!signature) {
        throw new Error('No signature');
      }

      await mutateConnectWallet({
        walletAddress: from,
        payload: {
          signedMessage: signature,
        },
      });
    } catch (err) {
      if ((err as ProviderRpcError).code) {
        // Code 4001 - User closed the MetaMask Browser extension while connecting
        // Code -32603 - User rejected the signature request
        if (![4001, -32603].includes((err as ProviderRpcError).code)) {
          toast.error('errors.connection-failed');
          return;
        }
        return;
      }
      toast.error('errors.connection-failed');
    } finally {
      setIsWaitingForSignature(false);
    }
  };

  const disconnect = async (walletAddress: string) => {
    try {
      await sdk?.terminate();
      await mutateDisconnectWallet(walletAddress);
    } catch (err) {
      toast.error('errors.disconnection-failed');
      console.error(err);
    }
  };

  const isProcessing =
    isWaitingForSignature ||
    !ready ||
    connecting ||
    isLoadingNonce ||
    isDisconnecting ||
    isConnectingMutationRunning;

  return {
    connect,
    disconnect,
    isProcessing,
  };
};
