import React from 'react';
import { HiX } from 'react-icons/hi';
import { ToastCard } from './ToastCard';

type ErrorToastProps = {
  children: React.ReactNode;
};

export const ErrorToast = ({ children }: ErrorToastProps) => (
  <ToastCard
    icon={HiX}
    iconClassName="bg-alert bg-opacity-20 text-alert"
  >
    {children}
  </ToastCard>
);
