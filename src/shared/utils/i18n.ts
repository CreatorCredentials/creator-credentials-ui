import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getI18nProps = async (
  locale: string | undefined,
  ns: string[] = [],
) => {
  // eslint-disable-next-line
  console.log('getI18nProps called');
  // eslint-disable-next-line
  console.log('getI18nProps locale: ', locale);
  if (!locale) {
    throw new Error('no locale getI18nProps exception');
  }
  return {
    ...(locale && (await serverSideTranslations(locale, ['common', ...ns]))),
  };
};
