import { Button } from 'flowbite-react';
import { useMetaMask } from '@/shared/hooks/useMetaMask';
import { AddressData } from 'contexts/AddressDataContext';

type Props = {
  connectLabel: string;
  disconnectLabel: string;
  isLoadingVerifiedCredentials?: boolean;
  walletAddress?: string | null;
  mutationCallBack: (newData: AddressData) => void;
};

export const MetamaskConnectionButton = ({
  connectLabel,
  disconnectLabel,
  isLoadingVerifiedCredentials,
  walletAddress,
  mutationCallBack,
}: Props) => {
  const { connect, disconnect, isProcessing } = useMetaMask({
    mutationCallBack,
  });

  const connectButtonHandler = async () => {
    await connect();
  };

  const disconnectButtonHandler = async () => {
    if (!walletAddress) return;

    await disconnect(walletAddress);
  };

  const isLoading = isProcessing || isLoadingVerifiedCredentials;

  return (
    <>
      {!walletAddress ? (
        <Button
          color="primary"
          fullSized
          onClick={connectButtonHandler}
          disabled={isLoading}
          isProcessing={isLoading}
        >
          {connectLabel}
        </Button>
      ) : (
        <Button
          color="primary"
          fullSized
          onClick={disconnectButtonHandler}
          disabled={isLoading}
          isProcessing={isLoading}
        >
          {disconnectLabel}
        </Button>
      )}
    </>
  );
};
