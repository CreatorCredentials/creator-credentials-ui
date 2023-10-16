import 'globals.css';
import { appWithTranslation } from 'next-i18next';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { config } from '@/shared/constants/config';
import { initMocks } from 'mocks';

const ENABLE_MOCKING = config.API_MOCKING === 'enabled';

function CreatorCredentialsApp({ Component, pageProps }: AppProps) {
  const [shouldRender, setShouldRender] = useState(!ENABLE_MOCKING);

  useEffect(() => {
    async function initMocks() {
      const { initMocks } = await import('mocks');
      await initMocks();
      setShouldRender(true);
    }

    if (ENABLE_MOCKING) {
      initMocks();
    }
  }, []);

  if (!shouldRender) {
    return null;
  }

  return <Component {...pageProps} />;
}

CreatorCredentialsApp.getInitialProps = async (
  context: AppContext,
): Promise<AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  await initMocks();

  return { ...ctx };
};

export default appWithTranslation(CreatorCredentialsApp);
