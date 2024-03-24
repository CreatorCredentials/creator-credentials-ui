import React, { ElementType } from 'react';
import Link from 'next/link';
import { DropdownItemProps } from 'flowbite-react';
import { Creator } from '@/shared/typings/Creator';
import { truncateWalletAddress } from '@/shared/utils/truncateWalletAddress';
import { BadgeType } from '@/shared/typings/BadgeType';
import { CardWithBadge } from '../CardWithBadge';

type CreatorDetailsCardProps = {
  creator: Creator;
  subtitle?: string;
  additionalBadgeType?: BadgeType;
  renderFooter?: ((creator: Creator) => React.ReactNode) | null;
  dropdownItems?: DropdownItemProps<ElementType>[];
};

export const CreatorDetailsCard = ({
  creator,
  subtitle,
  renderFooter,
  dropdownItems,
  additionalBadgeType = undefined,
}: CreatorDetailsCardProps) => {
  const { imageUrl, title, credentials } = creator;

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
            href: `/issuer/creators/${creator.id}`,
          },
        ]
      }
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
