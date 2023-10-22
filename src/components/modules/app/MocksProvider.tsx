import React, { useEffect, useRef } from 'react';
import { config } from '@/shared/constants/config';

const ENABLE_MOCKING = config.API_MOCKING === 'enabled';

const initMocks = async () => {
  console.info('Initializing mocks...');

  const { initMocks } = await import('@/mocks/index');

  await initMocks();
};

export type MocksProviderProps = {
  children: React.ReactNode;
};

export const MocksProvider = ({ children }: MocksProviderProps) => {
  const mocksInitialized = useRef(false);

  useEffect(() => {
    if (mocksInitialized.current === false && ENABLE_MOCKING) {
      initMocks();
    }

    return () => {
      mocksInitialized.current = true;
    };
  }, []);

  return <>{children}</>;
};
