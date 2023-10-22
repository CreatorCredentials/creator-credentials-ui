import React from 'react';
import { Toast } from 'flowbite-react';
import { IconType } from 'react-icons';
import { clsxm } from '@/shared/utils/clsxm';

type ToastCardProps = {
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  icon: IconType;
};

export const ToastCard = ({
  children,
  icon: Icon,
  className,
  iconClassName,
}: ToastCardProps) => (
  <Toast>
    <div
      className={clsxm(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
        iconClassName,
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div className={clsxm('ml-3 font-normal text-black', className)}>
      {children}
    </div>
    <Toast.Toggle />
  </Toast>
);
