import { Sidebar } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { signOut } from 'next-auth/react';
import { Icon } from '@/components/shared/Icon';

export const NavigationSignOutButton = () => {
  const { t } = useTranslation('common');

  const signOutHandler = async () => {
    try {
      await signOut({
        callbackUrl: '/welcome',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Sidebar.Item
      onClick={signOutHandler}
      as="button"
      className="w-full text-start"
      icon={() => (
        <Icon
          icon="ArrowLeftToBracket"
          className="text-grey-4"
        />
      )}
    >
      <p>{t('navigation.signout')}</p>
    </Sidebar.Item>
  );
};
