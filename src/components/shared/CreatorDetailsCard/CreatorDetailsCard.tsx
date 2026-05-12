import React, { ElementType } from 'react';
import Link from 'next/link';
import { DropdownItemProps } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { Creator } from '@/shared/typings/Creator';
import { BadgeType } from '@/shared/typings/BadgeType';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { useRevokeCreatorConnectionRequest } from '@/api/mutations/useRevokeCreatorConnectionRequest';
import { useIsDataSupplierIssuer } from '@/shared/hooks/useIsDataSupplierIssuer';
import { QueryKeys } from '@/api/queryKeys';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
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
  const queryClient = useQueryClient();
  const isDataSupplierIssuer = useIsDataSupplierIssuer();

  const emailAddress = credentials.email;
  const emailAddressClickHandler = () => {
    if (emailAddress) copy(emailAddress);
  };

  const { mutateAsync: revokeAsync } = useRevokeCreatorConnectionRequest({
    onSuccess: () => {
      queryClient.invalidateQueries([
        QueryKeys.issuerCreators,
        { status: CreatorVerificationStatus.Accepted },
      ]);
    },
  });
  return (
    <CardWithBadge
      badgeType={isDataSupplierIssuer ? 'dataSupplier' : 'creator'}
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
          {
            children: 'Disconnect',
            onClick: () => {
              revokeAsync({ creatorId: creator.id });
            },
          },
        ]
      }
      content={
        <>
          {emailAddress && (
            <CardWithBadge.ContentWithIcon
              iconName="Mail"
              className="justify-center"
              onClick={emailAddressClickHandler}
            >
              {emailAddress}
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
