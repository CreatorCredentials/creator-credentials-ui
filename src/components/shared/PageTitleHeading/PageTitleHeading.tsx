import React from 'react';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';

type PageTitleHeadingProps = {
  children: React.ReactNode;
  className?: ClassValue;
};

export const PageTitleHeading = ({
  children,
  className,
}: PageTitleHeadingProps) => (
  <h1 className={clsxm('mb-1 text-2xl', className)}>{children}</h1>
);
