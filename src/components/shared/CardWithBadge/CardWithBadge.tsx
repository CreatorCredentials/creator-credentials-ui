import { Card } from 'flowbite-react';
import { ReactNode } from 'react';
import { BadgeType } from '@/shared/typings/BadgeType';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { ColoredBadge } from '../ColoredBadge';
import { Icon, IconName } from '../Icon';

type ContentWithIconProps = {
  iconName: IconName;
  children: ReactNode;
  className?: string | ClassValue;
  onClick?: () => void;
};

const ContentWithIcon = ({
  iconName,
  children,
  className,
  onClick,
}: ContentWithIconProps) => {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      className={clsxm(
        'flex items-center fill-grey-4 py-1',
        {
          'cursor-pointer': Boolean(onClick),
        },
        className,
      )}
      onClick={onClick}
    >
      <Icon
        icon={iconName}
        className="me-2 min-h-[1.25rem] min-w-[1.25rem]"
      />
      <span className="break-all">{children}</span>
    </Wrapper>
  );
};

type CardWithBadgeProps = {
  badgeType?: BadgeType;
  title: string;
  iconName: IconName;
  content: ReactNode;
  footer: ReactNode;
  className?: string | ClassValue;
};

export const CardWithBadge = ({
  badgeType,
  title,
  iconName,
  content,
  footer,
  className,
}: CardWithBadgeProps) => (
  <Card className={clsxm('relative', className)}>
    <article className="flex flex-1 flex-col gap-2">
      <header className="flex flex-col gap-2">
        {badgeType && (
          <div className="-ms-4 -mt-4 self-start">
            <ColoredBadge badgeType={badgeType} />
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <Icon
            icon={iconName}
            className="me-2 h-[5.5rem] w-[5.5rem] fill-grey-4 text-grey-4"
          />
          <p className="text-xl text-black">{title}</p>
        </div>
      </header>
      <div className="flex-1 overflow-hidden text-base text-grey-4">
        {content}
      </div>
      <footer className="flex flex-col items-center gap-2 text-center">
        {footer}
      </footer>
    </article>
  </Card>
);

CardWithBadge.ContentWithIcon = ContentWithIcon;
