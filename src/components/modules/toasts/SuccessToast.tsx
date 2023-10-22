import React from 'react';
import { HiCheck } from 'react-icons/hi';
import { ToastCard } from './ToastCard';

type SuccessToastProps = {
  children: React.ReactNode;
};

export const SuccessToast = ({ children }: SuccessToastProps) => (
  <ToastCard
    icon={HiCheck}
    iconClassName="bg-success bg-opacity-20 text-success"
  >
    {children}
  </ToastCard>
);
