import { useTranslation } from 'next-i18next';
import React from 'react';
import { CredentialType } from '@/shared/typings/CredentialType';
import { VerifiedCredential } from '@/shared/typings/VerifiedCredential';
import { truncateWalletAddress } from '@/shared/utils/truncateWalletAddress';
import { CardWithBadge } from '../CardWithBadge';
import { IconName } from '../Icon';

const CREDENTIAL_TYPE_TO_ICON_NAME_MAP: Record<CredentialType, IconName> = {
  [CredentialType.Email]: 'Mail',
  [CredentialType.Wallet]: 'Payments',
  [CredentialType.Member]: 'AccountCircle',
};

type CredentialDetailsCardProps = {
  credential: VerifiedCredential;
  renderFooter?: ((credential: VerifiedCredential) => React.ReactNode) | null;
};

export const CredentialDetailsCard = ({
  credential,
  renderFooter,
}: CredentialDetailsCardProps) => {
  const { t } = useTranslation('cards');
  const { data, type } = credential;

  return (
    <CardWithBadge
      badgeType="credential"
      image={{
        iconName: CREDENTIAL_TYPE_TO_ICON_NAME_MAP[type],
      }}
      title={t(`credential.types.${type.toLowerCase()}.title`)}
      content={
        <>
          <p className="mb-2 text-base">
            {t(`credential.types.${type.toLowerCase()}.description`)}
          </p>
          {data.address && (
            <CardWithBadge.ContentWithIcon
              iconName="Public"
              className="whitespace-pre-wrap"
            >
              {type === CredentialType.Email
                ? data.address
                : truncateWalletAddress(data.address)}
            </CardWithBadge.ContentWithIcon>
          )}
          {data.companyName && (
            <CardWithBadge.ContentWithIcon
              iconName="AssuredWorkload"
              className="whitespace-pre-wrap"
            >
              {data.companyName}
            </CardWithBadge.ContentWithIcon>
          )}
          {data.requirements && (
            <CardWithBadge.ContentWithIcon
              iconName="Caption"
              className="whitespace-pre-wrap"
            >
              {data.requirements}
            </CardWithBadge.ContentWithIcon>
          )}
        </>
      }
      footer={renderFooter && renderFooter(credential)}
    ></CardWithBadge>
  );
};
