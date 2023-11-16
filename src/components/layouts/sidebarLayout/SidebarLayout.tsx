import React from 'react';
import { useSession } from 'next-auth/react';
import { FormFooter } from '@/components/shared/FormFooter';
import { Loader } from '@/components/shared/Loader';
import { Navigation } from './Navigation';

type SidebarLayoutProps = {
  children: React.ReactNode;
};

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const session = useSession();

  if (session.status === 'loading') {
    return <Loader />;
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Navigation />
        <div className="relative flex flex-1 flex-col">
          <div className="scrollbar z-50 flex flex-1 flex-col overflow-y-auto px-19 py-16">
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
          <FormFooter.PortalRoot />
        </div>
      </div>
    </div>
  );
};
