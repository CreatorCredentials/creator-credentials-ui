import dynamic from 'next/dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazy(importFn: () => Promise<any>) {
  return dynamic(async () => {
    const m = await importFn();
    return typeof m.default === 'function' ? m.default : m.ReactComponent;
  });
}

// https://flowbite.com/icons/
export const icons = {
  AccountBalanceWallet: lazy(
    () => import('@/public/images/icons/account-balance-wallet.svg'),
  ),
  ArrowLeft: lazy(() => import('@/public/images/icons/arrow-left.svg')),
  ArrowLeftToBracket: lazy(
    () => import('@/public/images/icons/arrow-left-to-bracket.svg'),
  ),
  ArrowRight: lazy(() => import('@/public/images/icons/arrow-right.svg')),
  BadgeCheck: lazy(() => import('@/public/images/icons/badge-check.svg')),
  Building: lazy(() => import('@/public/images/icons/building.svg')),
  Caption: lazy(() => import('@/public/images/icons/caption.svg')),
  Check: lazy(() => import('@/public/images/icons/check.svg')),
  Close: lazy(() => import('@/public/images/icons/close.svg')),
  DesignServices: lazy(
    () => import('@/public/images/icons/design-services.svg'),
  ),
  Home: lazy(() => import('@/public/images/icons/home.svg')),
  Info: lazy(() => import('@/public/images/icons/info.svg')),
  Mail: lazy(() => import('@/public/images/icons/mail.svg')),
  Metamask: lazy(() => import('@/public/images/icons/metamask.svg')),
  Public: lazy(() => import('@/public/images/icons/public.svg')),
  Refresh: lazy(() => import('@/public/images/icons/refresh.svg')),
  UserSettings: lazy(() => import('@/public/images/icons/user-settings.svg')),
  Warning: lazy(() => import('@/public/images/icons/warning.svg')),
};
