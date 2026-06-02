import { Card, Dropdown, DropdownItemProps } from 'flowbite-react';
import { ElementType, ReactNode } from 'react';
import Image from 'next/image';
import { BadgeType } from '@/shared/typings/BadgeType';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { ColoredBadge } from '../ColoredBadge';
import { Icon, IconName } from '../Icon';
import { IconButton } from '../IconButton';

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
        'flex w-full items-center justify-center overflow-hidden fill-grey-4 py-1',
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
      <p className="min-w-0 truncate text-center">{children}</p>
    </Wrapper>
  );
};

type CardWithBadgeProps = {
  badgeType?: BadgeType;
  additionalBadgeType?: BadgeType;
  title: string;
  subtitle?: string;
  content: ReactNode;
  footer: ReactNode;
  className?: string | ClassValue;
  image: { iconName: IconName } | { imageUrl: string; alt: string };
  dropdownItems?: DropdownItemProps<ElementType>[];
};

const defaultDropdownItems: DropdownItemProps<ElementType>[] = [];
// || [
//   {
//     children: 'Dropdown-item-1',
//   },
//   {
//     children: 'Dropdown-item-2',
//   },
// ];
export const CardWithBadge = ({
  badgeType,
  additionalBadgeType,
  title,
  subtitle,
  content,
  footer,
  className,
  image,
  dropdownItems = defaultDropdownItems,
}: CardWithBadgeProps) => (
  <Card className={clsxm('relative overflow-hidden', className)}>
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

          {dropdownItems.length > 0 ? (
            <div className="relative -me-4 h-6 w-6 self-end">
              <Dropdown
                label=""
                dismissOnClick={true}
                color="outline-black"
                renderTrigger={() => (
                  <IconButton
                    icon="MoreHoriz"
                    className="relative p-0"
                  />
                )}
              >
                {dropdownItems.map((item, index) => (
                  <Dropdown.Item
                    {...item}
                    className={clsxm('min-w-[300px]', item.className)}
                    key={item.key || index}
                  />
                ))}
              </Dropdown>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            className={clsxm('relative h-[5.5rem] w-[5.5rem] overflow-hidden', {
              'rounded-full': 'imageUrl' in image,
            })}
          >
            {'iconName' in image && (
              <Icon
                icon={image.iconName}
                className="h-full w-full fill-grey-4 text-grey-4"
              />
            )}
            {'imageUrl' in image &&
              (image.imageUrl ? (
                <Image
                  src={image.imageUrl}
                  fill
                  alt={image.alt}
                  className="object-cover"
                />
              ) : (
                <Icon
                  icon="AccountCircle"
                  className="h-full w-full fill-grey-4 text-grey-4"
                />
              ))}
          </div>
          <p className="w-full truncate text-center text-xl text-black">
            {title}
          </p>
          {subtitle && <p className="text-lg text-black">{subtitle}</p>}
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center overflow-hidden">
        <div className="w-full overflow-hidden text-center text-base text-grey-4">
          {content}
        </div>
      </div>
      {footer && (
        <footer className="flex flex-col items-center gap-2 text-center">
          {footer}
        </footer>
      )}
    </article>
  </Card>
);

CardWithBadge.ContentWithIcon = ContentWithIcon;
