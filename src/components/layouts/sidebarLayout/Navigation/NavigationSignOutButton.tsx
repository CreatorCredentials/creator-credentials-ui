import { Sidebar } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@/components/shared/Icon';

export const NavigationSignOutButton = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const signOutHandler = async () => {
    try {
      await signOut({
        redirect: false,
      });

      router.push('/welcome');
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
          className="me-2 text-grey-4"
        />
      )}
    >
      <p>{t('navigation.signout')}</p>
    </Sidebar.Item>
  );
};
