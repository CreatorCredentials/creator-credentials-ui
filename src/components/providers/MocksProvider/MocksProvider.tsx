import React, { useEffect, useState } from 'react';
import { config } from '@/shared/constants/config';

const ENABLE_MOCKING = config.API_MOCKING === 'enabled';

const initMocks = async (cb: (success: boolean) => void) => {
  if (!ENABLE_MOCKING) {
    return cb(true);
  }

  console.info('Initializing mocks...');

  const { initMocks } = await import('@/mocks/index');

  await initMocks();

  if (cb) {
    cb(true);
  }
};

export type MocksProviderProps = {
  children: React.ReactNode;
};

export const MocksProvider = ({ children }: MocksProviderProps) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initMocks(setInitialized);
  }, []);

  if (!initialized) {
    return null;
  }

  return <>{children}</>;
};
