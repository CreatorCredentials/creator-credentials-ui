import { Card } from 'flowbite-react';
import { ReactNode } from 'react';
import { BadgeType } from '@/shared/typings/BadgeType';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialAction } from '@/shared/typings/CredentialAction';
import { useTranslation } from '@/shared/utils/useTranslation';
import { ActionsMenu } from '../ActionsMenu';
import { ColoredBadge } from '../ColoredBadge';
import { Icon, IconName } from '../Icon';

type ContentWithIconProps = {
  iconName: IconName;
  children: ReactNode;
  className?: string | ClassValue;
  onClick?: () => void;
  testId?: string;
};

const ContentWithIcon = ({
  iconName,
  children,
  className,
  onClick,
  testId,
}: ContentWithIconProps) => {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      className={clsxm(
        'flex items-center fill-grey-4 py-1 text-left',
        {
          'cursor-pointer': Boolean(onClick),
        },
        className,
      )}
      onClick={onClick}
      data-testid={testId}
    >
      <Icon
        icon={iconName}
        className="me-2 min-h-[1.25rem] min-w-[1.25rem]"
      />
      <p className="break-all">{children}</p>
    </Wrapper>
  );
};

type CardWithBadgeProps = {
  badgeType?: BadgeType;
  additionalBadgeType?: BadgeType;
  title: string;
  subtitle?: string;
  content: ReactNode;
  credential: VerifiedCredentialsUnion;
  footer: ReactNode;
  className?: string | ClassValue;
  image: { iconName: IconName };
  dropdownItems?: CredentialAction[];
};

const CREDENTIAL_TYPE_TO_ICON_NAME_MAP: Record<CredentialType, IconName> = {
  [CredentialType.Email]: 'Mail',
  [CredentialType.Wallet]: 'AccountBalanceWallet',
  [CredentialType.Member]: 'Group',
  [CredentialType.DataSupplier]: 'Verified',
  [CredentialType.LicciumDataSupplier]: 'Verified',
  [CredentialType.Domain]: 'Public',
  [CredentialType.Connect]: 'Connect',
  [CredentialType.DidWeb]: 'Web',
  [CredentialType.ExternalKeypairVerification]: 'AssuredWorkload',
  [CredentialType.Creator]: 'Verified',
};

const NO_DROPDOWN_ITEMS: CredentialAction[] = [];

export const CardWithBadgeForCred = ({
  badgeType,
  additionalBadgeType,
  title,
  subtitle,
  credential,
  content,
  footer,
  className,
  image,
  dropdownItems = NO_DROPDOWN_ITEMS,
}: CardWithBadgeProps) => {
  const { t } = useTranslation('cards');

  return (
    <Card
      className={clsxm('relative', className)}
      data-testid="credential-card"
    >
      <article className="flex flex-1 flex-col gap-2">
        <header className="flex flex-col gap-2">
          <div className="-mt-4 flex justify-between">
            {badgeType && (
              <div className="-ms-4 flex flex-row gap-2 self-start">
                <ColoredBadge badgeType={badgeType} />
                {additionalBadgeType && (
                  <ColoredBadge badgeType={additionalBadgeType} />
                )}
              </div>
            )}

            {dropdownItems.length > 0 && (
              <div className="relative -me-4 h-6 w-6 self-end">
                <ActionsMenu
                  items={dropdownItems}
                  testId="credential-menu"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="mb-4 flex flex-col items-center gap-2">
              <div className="relative h-[5.5rem] w-[5.5rem]">
                <Icon
                  icon={CREDENTIAL_TYPE_TO_ICON_NAME_MAP[credential.type]}
                  className="h-full w-full fill-grey-4 text-grey-4"
                />
              </div>
              <p className="break-all text-xl text-black">
                {t(`credential.types.${credential.type.toLowerCase()}.title`)}
              </p>
              <p className="text-lg text-black">
                {t(`credential.subtitles.issued-to`)}
              </p>
            </div>

            <div className="relative h-[5.5rem] w-[5.5rem] overflow-hidden rounded-full">
              <Icon
                icon={image.iconName}
                className="h-full w-full fill-grey-4 text-grey-4"
              />
            </div>
            <p className="break-all text-xl text-black">{title}</p>
            {subtitle && <p className="text-lg text-black">{subtitle}</p>}
          </div>
        </header>
        <div className="flex-1 overflow-hidden text-base text-grey-4">
          {content}
        </div>
        {footer && (
          <footer className="flex flex-col items-center gap-2 text-center">
            {footer}
          </footer>
        )}
      </article>
    </Card>
  );
};

CardWithBadgeForCred.ContentWithIcon = ContentWithIcon;
