import React from 'react';
import { Navigation } from './Navigation';

type SidebarLayoutProps = {
  children: React.ReactNode;
};

export const SidebarLayout = ({ children }: SidebarLayoutProps) => (
  <div className="relative flex h-full flex-col">
    <div className="flex flex-1 overflow-hidden">
      <Navigation />
      <section className="scrollbar flex flex-1 flex-col overflow-y-auto px-19 py-16">
        {children}
      </section>
    </div>
  </div>
);
