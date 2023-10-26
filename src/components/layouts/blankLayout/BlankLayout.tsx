import React from 'react';
import { BrandImage } from '@/components/shared/BrandImage';

type BlankLayoutProps = {
  children: React.ReactNode;
};

export const BlankLayout = ({ children }: BlankLayoutProps) => (
  <div className="relative flex h-full flex-col overflow-auto">
    <BrandImage containerClassName="start-[4.125rem] top-[1.1875rem] invert" />
    {children}
  </div>
);
