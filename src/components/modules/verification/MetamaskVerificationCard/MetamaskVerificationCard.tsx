import { useTranslation } from 'next-i18next';
import { Tooltip } from 'flowbite-react';
import { MetamaskConnectionButton } from '@/components/shared/MetamaskConnectionButton';
import { CardWithBadge } from '@/components/shared/CardWithBadge';
import { useCreatorVerifiedCredentials } from '@/api/queries/useCreatorVerifiedCredentials';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { truncateWalletAddress } from '@/shared/utils/truncateWalletAddress';

export const MetamaskVerificationCard = () => {
  const { t } = useTranslation('verification-creator');
  const { copy } = useCopyToClipboard();

  const { data: verifiedCredentials, isLoading: isLoadingVerifiedCredentials } =
    useCreatorVerifiedCredentials();

  const walletAddress = verifiedCredentials?.metaMask;

  const truncatedWalletAddress = walletAddress
    ? truncateWalletAddress(walletAddress)
    : null;

  const walletAddressClickHandler = () => {
    if (walletAddress) {
      copy(walletAddress);
    }
  };

  return (
    <CardWithBadge
      badgeType="verification"
      title={t('metamask.title')}
      iconName="Metamask"
      className="flex-1"
      content={
        walletAddress ? (
          <Tooltip content={walletAddress}>
            <CardWithBadge.ContentWithIcon
              iconName="AccountBalanceWallet"
              className="whitespace-pre-wrap"
              onClick={walletAddressClickHandler}
            >
              {truncatedWalletAddress}
            </CardWithBadge.ContentWithIcon>
          </Tooltip>
        ) : (
          <p>{t('metamask.description')}</p>
        )
      }
      footer={
        <>
          <MetamaskConnectionButton
            connectLabel={t('metamask.buttons.connect')}
            disconnectLabel={t('metamask.buttons.disconnect')}
            walletAddress={walletAddress}
            isLoadingVerifiedCredentials={isLoadingVerifiedCredentials}
          />
          {walletAddress && (
            <ColoredBadge
              badgeType="connected"
              className="self-center"
            />
          )}
        </>
      }
    />
  );
};
