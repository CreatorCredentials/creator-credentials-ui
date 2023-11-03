import { IconName } from '@/components/shared/Icon';

export type NavigationRoute = {
  labelKey: string;
  href: string;
  iconName?: IconName;
  activeIconName?: IconName;
  exact?: boolean;
  suffixComponent?: React.ReactNode;
};
