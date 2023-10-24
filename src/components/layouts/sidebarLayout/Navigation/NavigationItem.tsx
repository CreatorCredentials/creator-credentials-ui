import { Sidebar } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { NavLink } from '@/components/shared/NavLink';
import { Icon } from '@/components/shared/Icon';
import { NavigationRoute } from './NavigationRoute';

export const NavigationItem = ({
  labelKey,
  iconName,
  ...linkProps
}: NavigationRoute) => {
  const { t } = useTranslation('common');

  return (
    <Sidebar.Item
      as={NavLink}
      icon={() => (
        <Icon
          icon={iconName}
          className="stroke-2"
        />
      )}
      {...linkProps}
    >
      <p>{t(labelKey)}</p>
    </Sidebar.Item>
  );
};
