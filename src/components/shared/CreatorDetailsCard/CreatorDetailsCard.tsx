import React from 'react';
import { Creator } from '@/shared/typings/Creator';
import { truncateWalletAddress } from '@/shared/utils/truncateWalletAddress';
import { CardWithBadge } from '../CardWithBadge';

type CreatorDetailsCardProps = {
  creator: Creator;
  renderFooter?: (creator: Creator) => React.ReactNode;
};

export const CreatorDetailsCard = ({
  creator,
  renderFooter,
}: CreatorDetailsCardProps) => {
  const { imageUrl, title, credentials } = creator;

  return (
    <CardWithBadge
      badgeType="creator"
      image={{
        imageUrl,
        alt: 'Creator image',
      }}
      title={title}
      content={
        <>
          <CardWithBadge.ContentWithIcon
            iconName="Mail"
            className="whitespace-pre-wrap"
          >
            {credentials.email}
          </CardWithBadge.ContentWithIcon>
          {credentials.walletAddress && (
            <CardWithBadge.ContentWithIcon
              iconName="AccountBalanceWallet"
              className="whitespace-pre-wrap"
            >
              {truncateWalletAddress(credentials.walletAddress)}
            </CardWithBadge.ContentWithIcon>
          )}
          {credentials.domain && (
            <CardWithBadge.ContentWithIcon
              iconName="Public"
              className="whitespace-pre-wrap"
            >
              {credentials.domain}
            </CardWithBadge.ContentWithIcon>
          )}
        </>
      }
      footer={renderFooter && renderFooter(creator)}
    />
  );
};
