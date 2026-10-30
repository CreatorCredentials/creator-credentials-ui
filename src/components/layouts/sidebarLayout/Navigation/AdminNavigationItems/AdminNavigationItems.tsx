import React from 'react';
import { NavigationRoute } from '../NavigationRoute';
import { NavigationSignOutButton } from '../NavigationSignOutButton';
import { NavigationItem } from '../NavigationItem';

const ADMIN_ROUTES: NavigationRoute[] = [
  {
    labelKey: 'navigation.credentials',
    href: '/admin/credentials',
    iconName: 'Caption',
    activeIconName: 'CaptionFilled',
  },
  {
    labelKey: 'navigation.users',
    href: '/admin/users',
    iconName: 'AccountCircle',
    activeIconName: 'AccountCircleFilled',
  },
  {
    labelKey: 'navigation.verify',
    href: '/admin/verify',
    iconName: 'Verified',
    activeIconName: 'VerifiedFilled',
  },
];

const mappedAdminRoutes = ADMIN_ROUTES.map((props) => (
  <NavigationItem
    {...props}
    key={props.href}
  />
));

export const AdminNavigationItems = () => (
  <>
    <div className="pt-[6rem]">{mappedAdminRoutes}</div>
    <div>
      <NavigationSignOutButton />
    </div>
  </>
);
