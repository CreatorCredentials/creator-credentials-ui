import { Sidebar } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { BrandImage } from '@/components/shared/BrandImage';
import { UserRole } from '@/shared/typings/UserRole';
import { NavigationItem } from './NavigationItem';
import { NavigationRoute } from './NavigationRoute';
import { NavigationSignOutButton } from './NavigationSignOutButton';

const CREATOR_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.home',
    href: '/creator',
    iconName: 'Home',
    exact: true,
  },
  {
    labelKey: 'navigation.verification',
    href: '/creator/verification',
    iconName: 'BadgeCheck',
  },
  {
    labelKey: 'navigation.issuers',
    href: '/creator/issuers',
    iconName: 'Building',
  },
  {
    labelKey: 'navigation.credentials',
    href: '/creator/credentials',
    iconName: 'Caption',
  },
];
const ISSUER_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.home',
    href: '/issuer',
    iconName: 'Home',
    exact: true,
  },
  {
    labelKey: 'navigation.verification',
    href: '/issuer/verification',
    iconName: 'BadgeCheck',
  },
  {
    labelKey: 'navigation.creators',
    href: '/issuer/creators',
    iconName: 'Building',
  },
  {
    labelKey: 'navigation.credentials',
    href: '/issuer/credentials',
    iconName: 'Caption',
  },
];

const SUB_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.profile',
    href: '/profile',
    iconName: 'UserSettings',
  },
];

export const Navigation = () => {
  const session = useSession();

  const routes =
    session.data?.user?.role === UserRole.Creator
      ? CREATOR_ROUTES
      : ISSUER_ROUTES;

  return (
    <Sidebar className="relative flex w-[11.5rem] flex-col border-e-2 border-gray-200">
      <Sidebar.Items className="h-full">
        <Sidebar.ItemGroup className="flex h-full flex-col justify-between">
          <div className="pt-[7.75rem]">
            <BrandImage />
            {routes.map((props) => (
              <NavigationItem
                {...props}
                key={props.href}
              />
            ))}
          </div>
          <div>
            {SUB_ROUTES.map((props) => (
              <NavigationItem
                {...props}
                key={props.href}
              />
            ))}
            <NavigationSignOutButton />
          </div>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
