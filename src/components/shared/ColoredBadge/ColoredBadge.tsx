import { useTranslation } from 'next-i18next';
import { BadgeType } from '@/shared/typings/BadgeType';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { Icon, IconName } from '../Icon';

const BADGE_PROPS_MAP: Record<
  BadgeType,
  {
    tKey: string;
    iconName: IconName;
    className: ClassValue;
  }
> = {
  verification: {
    tKey: 'badges.verification',
    iconName: 'BadgeCheck',
    className: 'fill-verification text-verification bg-verification/5',
  },
  credential: {
    tKey: 'badges.credential',
    iconName: 'Close',
    className: 'fill-credential text-credential bg-credential/10',
  },
  creator: {
    tKey: 'badges.creator',
    iconName: 'Caption',
    className: 'fill-creator text-creator bg-creator/10',
  },
  issuer: {
    tKey: 'badges.issuer',
    iconName: 'UserSettings',
    className: 'fill-issuer text-issuer bg-issuer/10',
  },
  verified: {
    tKey: 'verified',
    iconName: 'BadgeCheck',
    className: 'fill-success text-success text-base',
  },
  connected: {
    tKey: 'connected',
    iconName: 'BadgeCheck',
    className: 'fill-success text-success text-base',
  },
};

type ColoredBadgeProps = {
  badgeType: BadgeType;
  className?: string | ClassValue;
};

export const ColoredBadge = ({ badgeType, className }: ColoredBadgeProps) => {
  const { t } = useTranslation('common');

  const {
    tKey,
    iconName,
    className: mapClassName,
  } = BADGE_PROPS_MAP[badgeType];

  return (
    <div
      className={clsxm(
        'inline-flex items-center justify-center self-start rounded-md px-2 py-[0.3rem]',
        className,
        mapClassName,
      )}
      aria-hidden="true"
    >
      <Icon
        icon={iconName}
        className="me-2 h-4 w-4"
      />
      <span className="text-sm">{t(tKey)}</span>
    </div>
  );
};
