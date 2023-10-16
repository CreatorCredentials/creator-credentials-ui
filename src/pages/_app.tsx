import 'globals.css';
import { appWithTranslation } from 'next-i18next';
import { FC } from 'react';
import type { AppProps } from 'next/app';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default appWithTranslation(App);
