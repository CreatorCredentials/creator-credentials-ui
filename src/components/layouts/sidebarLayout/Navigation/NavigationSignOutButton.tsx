import { Sidebar } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { HiLogout } from 'react-icons/hi';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

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
      icon={HiLogout}
    >
      <p>{t('navigation.signout')}</p>
    </Sidebar.Item>
  );
};
