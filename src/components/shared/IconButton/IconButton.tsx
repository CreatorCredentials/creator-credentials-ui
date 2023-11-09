import React from 'react';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { Icon, IconName } from '../Icon';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  className?: string | ClassValue;
};

export const IconButton = ({
  icon,
  className,
  onClick,
  ...restProps
}: IconButtonProps) => (
  <button
    onClick={onClick}
    className={clsxm('p-2', className)}
    {...restProps}
  >
    <Icon
      icon={icon}
      className="h-6 w-6"
    />
  </button>
);
