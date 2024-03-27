import React, { ElementType } from 'react';
import Link from 'next/link';
import { DropdownItemProps, Tooltip } from 'flowbite-react';
import { Creator } from '@/shared/typings/Creator';
import {
  truncateEmailAddress,
  truncateWalletAddress,
} from '@/shared/utils/truncateWalletAddress';
import { BadgeType } from '@/shared/typings/BadgeType';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { CardWithBadge } from '../CardWithBadge';

type CreatorDetailsCardProps = {
  creator: Creator;
  subtitle?: string;
  backRoute?: string;
  additionalBadgeType?: BadgeType;
  renderFooter?: ((creator: Creator) => React.ReactNode) | null;
  dropdownItems?: DropdownItemProps<ElementType>[];
};

export const CreatorDetailsCard = ({
  creator,
  subtitle,
  renderFooter,
  dropdownItems,
  backRoute,
  additionalBadgeType = undefined,
}: CreatorDetailsCardProps) => {
  const { imageUrl, title, credentials } = creator;
  const { copy } = useCopyToClipboard();

  const walletAddress = credentials.walletAddress;
  const truncatedWalletAddress = walletAddress
    ? truncateWalletAddress(walletAddress)
    : null;

  const walletAddressClickHandler = () => {
    if (walletAddress) {
      copy(walletAddress);
    }
  };

  const emailAddress = credentials.email;

  const truncatedEmailAddress = emailAddress
    ? truncateEmailAddress(emailAddress)
    : null;

  const emailAddressClickHandler = () => {
    if (emailAddress) {
      copy(emailAddress);
    }
  };
  return (
    <CardWithBadge
      badgeType="creator"
      additionalBadgeType={additionalBadgeType}
      image={{
        imageUrl,
        alt: 'Creator image',
      }}
      title={title}
      subtitle={subtitle}
      dropdownItems={
        dropdownItems || [
          {
            children: 'Show details',
            as: Link,
            href:
              `/issuer/creators/${creator.id}` +
              (backRoute ? `?backRoute=${encodeURIComponent(backRoute)}` : ''),
          },
        ]
      }
      content={
        <>
          {emailAddress ? (
            <Tooltip content={emailAddress}>
              <CardWithBadge.ContentWithIcon
                iconName="Mail"
                className="whitespace-pre-wrap"
                onClick={emailAddressClickHandler}
              >
                {truncatedEmailAddress}
              </CardWithBadge.ContentWithIcon>
            </Tooltip>
          ) : null}
          {walletAddress ? (
            <Tooltip content={walletAddress}>
              <CardWithBadge.ContentWithIcon
                iconName="AccountBalanceWallet"
                className="whitespace-pre-wrap"
                onClick={walletAddressClickHandler}
              >
                {truncatedWalletAddress}
              </CardWithBadge.ContentWithIcon>
            </Tooltip>
          ) : null}
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
