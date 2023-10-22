import React, { useCallback } from 'react';
// eslint-disable-next-line no-restricted-imports
import toast from 'react-hot-toast';
import { ErrorToast } from '@/components/modules/toasts/ErrorToast';
import { SuccessToast } from '@/components/modules/toasts/SuccessToast';

export const useToast = () => {
  const error = useCallback(
    (message: string) => toast.custom(<ErrorToast>{message}</ErrorToast>),
    [],
  );

  const success = useCallback(
    (message: string) => toast.custom(<SuccessToast>{message}</SuccessToast>),
    [],
  );

  return {
    error,
    success,
  };
};
