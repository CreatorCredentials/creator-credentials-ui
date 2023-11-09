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
    activeIconName: 'HomeFilled',
    exact: true,
  },
  {
    labelKey: 'navigation.verification',
    href: '/creator/verification',
    iconName: 'Verified',
    activeIconName: 'VerifiedFilled',
  },
  {
    labelKey: 'navigation.issuers',
    href: '/creator/issuers',
    iconName: 'AssuredWorkload',
    activeIconName: 'AssuredWorkloadFilled',
  },
  {
    labelKey: 'navigation.credentials',
    href: '/creator/credentials',
    iconName: 'Caption',
    activeIconName: 'CaptionFilled',
  },
];

const CREATOR_SUB_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.profile',
    href: '/creator/profile',
    iconName: 'AccountCircle',
    activeIconName: 'AccountCircleFilled',
  },
];

const ISSUER_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.home',
    href: '/issuer',
    iconName: 'Home',
    activeIconName: 'HomeFilled',
    exact: true,
  },
  {
    labelKey: 'navigation.verification',
    href: '/issuer/verification',
    iconName: 'Verified',
    activeIconName: 'VerifiedFilled',
  },
  {
    labelKey: 'navigation.creators',
    href: '/issuer/creators',
    iconName: 'DesignServices',
    activeIconName: 'DesignServicesFilled',
  },
  {
    labelKey: 'navigation.requested',
    href: '/issuer/creators/requested',
    suffixComponent: <NavigationItem.CountBadge>10</NavigationItem.CountBadge>,
  },
  {
    labelKey: 'navigation.accepted',
    href: '/issuer/creators/accepted',
  },
];

const ISSUER_SUB_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.profile',
    href: '/issuer/profile',
    iconName: 'AccountCircle',
    activeIconName: 'AccountCircleFilled',
  },
  {
    labelKey: 'navigation.credentials',
    href: '/issuer/credentials',
    iconName: 'Caption',
    activeIconName: 'CaptionFilled',
  },
];

export const Navigation = () => {
  const session = useSession();

  const routes =
    session.data?.user?.role === UserRole.Creator
      ? CREATOR_ROUTES
      : ISSUER_ROUTES;

  const subRoutes =
    session.data?.user?.role === UserRole.Creator
      ? CREATOR_SUB_ROUTES
      : ISSUER_SUB_ROUTES;

  return (
    <Sidebar className="flex w-[11.5rem] flex-col border-e-2 border-gray-200">
      <Sidebar.Items className="h-full">
        <Sidebar.ItemGroup className="relative flex h-full flex-col justify-between">
          <BrandImage containerClassName="left-0 right-0 top-4 m-auto" />
          <div className="pt-[6rem]">
            {routes.map((props) => (
              <NavigationItem
                {...props}
                key={props.href}
              />
            ))}
          </div>
          <div>
            {subRoutes.map((props) => (
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
