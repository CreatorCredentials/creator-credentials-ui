import React, { ElementType } from 'react';
import { DropdownItemProps, Tooltip } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { CredentialType } from '@/shared/typings/CredentialType';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { truncateWalletAddress } from '@/shared/utils/truncateWalletAddress';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { CardWithBadge } from '../CardWithBadge';
import { Icon, IconName } from '../Icon';

const CREDENTIAL_TYPE_TO_ICON_NAME_MAP: Record<CredentialType, IconName> = {
  [CredentialType.Email]: 'Mail',
  [CredentialType.Wallet]: 'AccountBalanceWallet',
  [CredentialType.Member]: 'Group',
  [CredentialType.DataSupplier]: 'Verified',
  [CredentialType.Domain]: 'Public',
  [CredentialType.DidWeb]: 'Web',
  [CredentialType.Connect]: 'Connect',
  [CredentialType.ExternalKeypairVerification]: 'AssuredWorkload',
};

type CredentialDetailsCardProps = {
  credential: Omit<VerifiedCredentialsUnion, 'id'>;
  renderFooter?:
    | ((credential: Omit<VerifiedCredentialsUnion, 'id'>) => React.ReactNode)
    | null;
  dropdownItems?: DropdownItemProps<ElementType>[];
};

export const CredentialDetailsCard = ({
  credential,
  renderFooter,
  dropdownItems,
}: CredentialDetailsCardProps) => {
  const { t } = useTranslation('cards');
  const { data, type } = credential;
  const { copy } = useCopyToClipboard();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = (data as any)?.credentialObject?.proof?.jwt as string | undefined;
  const verifyItem = jwt
    ? [
        {
          children: 'Verify',
          onClick: () =>
            window.open(
              `https://jwt.io/#token=${encodeURIComponent(jwt)}`,
              '_blank',
            ),
        },
      ]
    : [];
  const allDropdownItems = [...(dropdownItems ?? []), ...verifyItem];

  const address =
    (type === CredentialType.Email || type === CredentialType.Wallet) &&
    'address' in data
      ? data.address
      : undefined;

  const addressClickHandler = () => {
    if (address) {
      copy(address);
    }
  };

  return (
    <CardWithBadge
      badgeType="credential"
      image={{
        iconName: CREDENTIAL_TYPE_TO_ICON_NAME_MAP[type],
      }}
      title={t(`credential.types.${type.toLowerCase()}.title`)}
      dropdownItems={allDropdownItems}
      content={
        <>
          <p className="mb-2 text-base">
            {t(`credential.types.${type.toLowerCase()}.description`)}
          </p>
          {type === CredentialType.Email && 'address' in data && address ? (
            <Tooltip content={address}>
              <button
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden fill-grey-4 py-1"
                onClick={addressClickHandler}
              >
                <Icon
                  icon="Public"
                  className="me-2 min-h-[1.25rem] min-w-[1.25rem] shrink-0"
                />
                <span className="min-w-0 truncate">{data.address}</span>
              </button>
            </Tooltip>
          ) : null}
          {type === CredentialType.Wallet && 'address' in data && address ? (
            <Tooltip content={address}>
              <CardWithBadge.ContentWithIcon
                iconName="AccountBalanceWallet"
                className="whitespace-pre-wrap"
                onClick={addressClickHandler}
              >
                {truncateWalletAddress(data.address)}
              </CardWithBadge.ContentWithIcon>
            </Tooltip>
          ) : null}
          {type === CredentialType.Domain && 'domain' in data && (
            <CardWithBadge.ContentWithIcon
              iconName="AccountBalanceWallet"
              className="whitespace-pre-wrap"
            >
              {data.domain}
            </CardWithBadge.ContentWithIcon>
          )}
          {type === CredentialType.ExternalKeypairVerification &&
            'sameAs' in data &&
            data.sameAs && (
              <CardWithBadge.ContentWithIcon
                iconName="AssuredWorkload"
                className="whitespace-pre-wrap"
              >
                {data.sameAs}
              </CardWithBadge.ContentWithIcon>
            )}
          {'companyName' in data &&
            data.companyName &&
            type !== CredentialType.Connect && (
              <CardWithBadge.ContentWithIcon
                iconName="AssuredWorkload"
                className="whitespace-pre-wrap"
              >
                {data.companyName}
              </CardWithBadge.ContentWithIcon>
            )}
          {'validity' in data &&
            type !== CredentialType.Connect &&
            type !== CredentialType.DataSupplier && (
              <CardWithBadge.ContentWithIcon
                iconName="CalendarMonth"
                className="whitespace-pre-wrap"
              >
                {data.validity}
              </CardWithBadge.ContentWithIcon>
            )}
          {'requirements' in data && type !== CredentialType.DataSupplier && (
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
