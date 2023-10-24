import React from 'react';
import { BrandImage } from '@/components/shared/BrandImage';

type BlankLayoutProps = {
  children: React.ReactNode;
};

export const BlankLayout = ({ children }: BlankLayoutProps) => (
  <div className="relative flex h-full flex-col overflow-auto">
    <BrandImage className="invert" />
    {children}
  </div>
);
