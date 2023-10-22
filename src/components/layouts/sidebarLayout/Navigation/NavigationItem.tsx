import { Sidebar } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { NavLink } from '@/components/shared/NavLink';
import { NavigationRoute } from './NavigationRoute';

export const NavigationItem = ({ labelKey, ...linkProps }: NavigationRoute) => {
  const { t } = useTranslation('common');

  return (
    <Sidebar.Item
      as={NavLink}
      {...linkProps}
    >
      <p>{t(labelKey)}</p>
    </Sidebar.Item>
  );
};
