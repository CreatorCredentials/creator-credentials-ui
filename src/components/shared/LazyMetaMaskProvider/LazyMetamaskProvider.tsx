import dynamic from 'next/dynamic';

export const LazyMetaMaskProvider = dynamic(
  () => import('./MetaMaskProvider').then((module) => module.MetaMaskProvider),
  {
    ssr: false,
  },
);
