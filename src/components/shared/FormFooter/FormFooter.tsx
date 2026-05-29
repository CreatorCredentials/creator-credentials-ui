import { Button, ButtonProps } from 'flowbite-react';
import React, { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/shared/utils/useTranslation';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { Icon } from '../Icon';

const FOOTER_PORTAL_ID = 'footer-portal-root';

// Stable references so `useSyncExternalStore` doesn't re-subscribe on every
// render. We only need a one-shot "are we on the client yet" signal so the
// store never actually emits.
const subscribeIsHydrated = () => () => {};
const getIsHydratedClientSnapshot = () => true;
const getIsHydratedServerSnapshot = () => false;

type FormFooterProps = {
  className?: string | ClassValue;
  children?: React.ReactNode;
};

export const FormFooter = ({ className, children }: FormFooterProps) => {
  // SSR guard: render `null` until after hydration so the portal target is
  // guaranteed to exist before we read it. `useSyncExternalStore` is the
  // React-recommended way to express "is this the client?" without using an
  // effect-driven `setMount(true)` (which trips `react-hooks/set-state-in-effect`).
  const isHydrated = useSyncExternalStore(
    subscribeIsHydrated,
    getIsHydratedClientSnapshot,
    getIsHydratedServerSnapshot,
  );

  if (!isHydrated) return null;

  const portalRoot = document.getElementById(FOOTER_PORTAL_ID);
  if (!portalRoot) return null;

  return createPortal(
    <footer
      className={clsxm(
        'flex w-full justify-between border-t border-grey-2 bg-white px-8 py-3',
        className,
      )}
    >
      {children}
    </footer>,
    portalRoot,
  );
};

const BackButton = (props: ButtonProps) => {
  const { t } = useTranslation('common');

  return (
    <Button
      color="text"
      {...props}
    >
      <Icon
        icon="ArrowLeft"
        className="me-2"
      />
      {t('back')}
    </Button>
  );
};

const NextButton = (props: ButtonProps) => {
  const { t } = useTranslation('common');

  return (
    <Button
      color="primary"
      {...props}
    >
      {t('next')}
      <Icon
        icon="ArrowRight"
        className="ms-2"
      />
    </Button>
  );
};

const ConfirmButton = (props: ButtonProps) => {
  const { t } = useTranslation('common');

  return (
    <Button
      color="primary"
      {...props}
    >
      {t('confirm')}
      <Icon
        icon="ArrowRight"
        className="ms-2"
      />
    </Button>
  );
};

const PortalRoot = ({ className }: { className?: string }) => (
  <div
    id={FOOTER_PORTAL_ID}
    className={className}
  />
);

FormFooter.PortalRoot = PortalRoot;
FormFooter.BackButton = BackButton;
FormFooter.NextButton = NextButton;
FormFooter.ConfirmButton = ConfirmButton;
