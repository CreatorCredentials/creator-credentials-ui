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
  Home: lazy(() => import('@/public/images/icons/home.svg')),
  PenNib: lazy(() => import('@/public/images/icons/pen-nib.svg')),
  UserSettings: lazy(() => import('@/public/images/icons/user-settings.svg')),
};
