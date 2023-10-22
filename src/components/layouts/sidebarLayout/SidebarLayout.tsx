import React from 'react';
import { Navigation } from './Navigation';

type SidebarLayoutProps = {
  children: React.ReactNode;
};

export const SidebarLayout = ({ children }: SidebarLayoutProps) => (
  <div className="relative flex h-full flex-col">
    <div className="flex flex-1">
      <Navigation />
      <section className="flex flex-1 flex-col overflow-y-auto">
        {children}
      </section>
    </div>
  </div>
);
