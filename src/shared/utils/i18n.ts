import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextI18NextConfig = require('../../../next-i18next.config');

export const getI18nProps = async (
  locale: string | undefined,
  ns: string[] = [],
) => {
  const result = await serverSideTranslations(
    locale || 'en',
    ['common', ...ns],
    nextI18NextConfig,
  );

  return {
    ...result,
  };
};
