import { Sidebar } from 'flowbite-react';
import { BrandImage } from '@/components/shared/BrandImage';
import { NavigationItem } from './NavigationItem';
import { NavigationRoute } from './NavigationRoute';
import { NavigationSignOutButton } from './NavigationSignOutButton';

const MAIN_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.home',
    href: '/home',
    iconName: 'Home',
  },
  {
    labelKey: 'navigation.verification',
    href: '/verification',
    iconName: 'BadgeCheck',
  },
  {
    labelKey: 'navigation.issuers',
    href: '/issuers',
    iconName: 'Building',
  },
  {
    labelKey: 'navigation.credentials',
    href: '/credentials',
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

export const Navigation = () => (
  <nav className="flex flex-col">
    <Sidebar
      aria-label="Default sidebar example"
      className="relative flex w-[11.5rem] border-e-2 border-gray-200"
    >
      <Sidebar.Items className="h-full">
        <Sidebar.ItemGroup className="flex h-full flex-col justify-between">
          <div className="pt-[7.75rem]">
            <BrandImage />
            {MAIN_ROUTES.map((props) => (
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
  </nav>
);
