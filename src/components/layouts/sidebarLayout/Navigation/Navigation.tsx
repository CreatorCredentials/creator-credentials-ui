import { Sidebar } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { UserRole } from '@/shared/typings/UserRole';
import { BrandImage } from '@/components/shared/BrandImage';
import { CreatorNavigationItems } from './CreatorNavigationItems';
import { IssuerNavigationItems } from './IssuerNavigationItems';

export const Navigation = () => {
  const session = useSession();

  const NavigationIems = useMemo(() => {
    switch (session.data?.user?.role) {
      case UserRole.Creator:
        return CreatorNavigationItems;
      case UserRole.Issuer:
        return IssuerNavigationItems;
      default:
        return null;
    }
  }, [session.data?.user?.role]);

  return (
    <Sidebar className="flex w-[11.5rem] flex-col border-e-2 border-gray-200">
      <Sidebar.Items className="h-full">
        <Sidebar.ItemGroup className="relative flex h-full flex-col justify-between">
          <BrandImage containerClassName="left-0 right-0 top-4 m-auto" />
          {NavigationIems && <NavigationIems />}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
