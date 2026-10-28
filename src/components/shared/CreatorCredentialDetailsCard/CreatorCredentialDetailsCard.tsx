import React from 'react';
import { Tooltip } from 'flowbite-react';
import { truncateWalletAddress } from '@/shared/utils/truncateWalletAddress';
import { BadgeType } from '@/shared/typings/BadgeType';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { useIsDataSupplierIssuer } from '@/shared/hooks/useIsDataSupplierIssuer';
import { IssuedCredential } from '@/shared/typings/Credentials';
import { CredentialAction } from '@/shared/typings/CredentialAction';
import { CreatorConnectionStatus } from '@/shared/typings/CreatorConnectionStatus';
import { creatorDisplayName, creatorOf } from '@/shared/utils/credentialsList';
import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';
import { ConnectionRevokedMarker } from '@/components/modules/creators/ConnectionRevokedMarker';
import { CardWithBadgeForCred } from '../CardWithBadgeForCred';

type CreatorCredentialDetailsCardProps = {
  credential: IssuedCredential;
  subtitle?: string;
  additionalBadgeType?: BadgeType;
  renderFooter?: ((credential: IssuedCredential) => React.ReactNode) | null;
  dropdownItems?: CredentialAction[];
};

export const CreatorCredentialDetailsCard = ({
  credential,
  subtitle,
  renderFooter,
  dropdownItems,
  additionalBadgeType = undefined,
}: CreatorCredentialDetailsCardProps) => {
  const { email, didKey } = creatorOf(credential);
  const { copy } = useCopyToClipboard();
  const isDataSupplierIssuer = useIsDataSupplierIssuer();
  const isConnectionRevoked =
    credential.connectionStatus === CreatorConnectionStatus.Revoked;

  return (
    <CardWithBadgeForCred
      badgeType={isDataSupplierIssuer ? 'dataSupplier' : 'creator'}
      additionalBadgeType={additionalBadgeType}
      credential={credential}
      image={{ iconName: 'AccountCircle' }}
      title={creatorDisplayName(credential) || EMPTY_VALUE_PLACEHOLDER}
      subtitle={subtitle}
      dropdownItems={dropdownItems}
      content={
        <>
          {email ? (
            <CardWithBadgeForCred.ContentWithIcon
              iconName="Mail"
              className="whitespace-pre-wrap"
              onClick={() => copy(email)}
              testId="credential-email"
            >
              {email}
            </CardWithBadgeForCred.ContentWithIcon>
          ) : null}
          {didKey ? (
            <Tooltip content={didKey}>
              <CardWithBadgeForCred.ContentWithIcon
                iconName="AssuredWorkload"
                className="whitespace-pre-wrap"
                onClick={() => copy(didKey)}
              >
                {truncateWalletAddress(didKey)}
              </CardWithBadgeForCred.ContentWithIcon>
            </Tooltip>
          ) : null}
          {isConnectionRevoked && <ConnectionRevokedMarker className="mt-2" />}
        </>
      }
      footer={renderFooter && renderFooter(credential)}
    />
  );
};
