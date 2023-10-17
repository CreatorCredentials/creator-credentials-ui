import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'globals.css';
import { appWithTranslation } from 'next-i18next';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import { useState } from 'react';
import { config } from '@/shared/constants/config';
import { initMocks } from '@/mocks/index';
import { MocksProvider } from '@/components/providers/MocksProvider/MocksProvider';
import { createQueryClient } from '@/shared/utils/queryClient';

function CreatorCredentialsApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => createQueryClient());

  console.info('CreatorCredentialsApp');

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <MocksProvider>
          <Component {...pageProps} />
        </MocksProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

CreatorCredentialsApp.getInitialProps = async (
  context: AppContext,
): Promise<AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  if (config.API_MOCKING === 'enabled') {
    await initMocks();
  }

  return { ...ctx };
};

export default appWithTranslation(CreatorCredentialsApp);
