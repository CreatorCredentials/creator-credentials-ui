import { Sidebar } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { NavLink } from '@/components/shared/NavLink';
import { Icon } from '@/components/shared/Icon';
import { NavigationRoute } from './NavigationRoute';

type NavigationItemCountBadgeProps = {
  children: React.ReactNode;
};

const NavigationItemCountBadge = ({
  children,
}: NavigationItemCountBadgeProps) => (
  <div className="absolute top-2.5 ms-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-alert text-center text-xs font-normal text-white">
    {children}
  </div>
);

export const NavigationItem = ({
  labelKey,
  iconName,
  activeIconName,
  href,
  exact,
  suffixComponent,
  ...linkProps
}: NavigationRoute) => {
  const { t } = useTranslation('common');

  const { asPath } = useRouter();

  const isActive = exact
    ? asPath === href.toString()
    : asPath.startsWith(href.toString());

  return (
    <Sidebar.Item
      as={NavLink}
      icon={() =>
        iconName && activeIconName ? (
          <Icon
            icon={isActive ? activeIconName : iconName}
            className="fill-black"
          />
        ) : (
          <div className="ms-0.5">&nbsp;</div>
        )
      }
      isActive={isActive}
      href={href}
      className="relative"
      {...linkProps}
    >
      <span>{t(labelKey)}</span>
      {suffixComponent}
    </Sidebar.Item>
  );
};

NavigationItem.CountBadge = NavigationItemCountBadge;
