import React, { ReactNode } from 'react';
import { MetaMaskProvider as SDKMetaMaskProvider } from '@metamask/sdk-react';

type MetamaskProviderProps = {
  children: ReactNode;
};

export const MetaMaskProvider = ({ children }: MetamaskProviderProps) => (
  <SDKMetaMaskProvider
    debug={true}
    sdkOptions={{
      checkInstallationImmediately: false,
      dappMetadata: {
        name: 'Creator Credentials',
        url: window.location.host,
      },
      extensionOnly: true,
      preferDesktop: true,
    }}
  >
    {children}
  </SDKMetaMaskProvider>
);
