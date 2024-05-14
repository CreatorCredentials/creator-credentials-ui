import React from 'react';

type BlankLayoutProps = {
  children: React.ReactNode;
};

export const NoLogoBlankLayout = ({ children }: BlankLayoutProps) => (
  <div className="relative flex h-full flex-col overflow-auto pb-16">
    <main className="flex h-full flex-1 flex-col items-center justify-center">
      {children}
    </main>
  </div>
);
