import { Sidebar } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { NavLink } from '@/components/shared/NavLink';
import { Icon } from '@/components/shared/Icon';
import { clsxm } from '@/shared/utils/clsxm';
import { NavigationRoute } from './NavigationRoute';

export const NavigationItem = ({
  labelKey,
  iconName,
  href,
  exact,
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
      icon={() => (
        <Icon
          icon={iconName}
          className={clsxm('stroke-2 text-grey-4', {
            'text-black': isActive,
          })}
        />
      )}
      isActive={isActive}
      href={href}
      {...linkProps}
    >
      <p>{t(labelKey)}</p>
    </Sidebar.Item>
  );
};
