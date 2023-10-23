import React from 'react';
import { ToastCard } from './ToastCard';

type ErrorToastProps = {
  children: React.ReactNode;
};

export const ErrorToast = ({ children }: ErrorToastProps) => (
  <ToastCard
    iconName="Close"
    iconClassName="bg-alert bg-opacity-20 text-alert"
  >
    {children}
  </ToastCard>
);
