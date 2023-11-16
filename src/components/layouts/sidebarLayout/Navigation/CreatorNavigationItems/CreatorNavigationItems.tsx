import React from 'react';
import { NavigationRoute } from '../NavigationRoute';
import { NavigationItem } from '../NavigationItem';
import { NavigationSignOutButton } from '../NavigationSignOutButton';

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

export const CreatorNavigationItems = () => {
  return (
    <>
      <div className="pt-[6rem]">
        {CREATOR_ROUTES.map((props) => (
          <NavigationItem
            {...props}
            key={props.href}
          />
        ))}
      </div>
      <div>
        {CREATOR_SUB_ROUTES.map((props) => (
          <NavigationItem
            {...props}
            key={props.href}
          />
        ))}
        <NavigationSignOutButton />
      </div>
    </>
  );
};
