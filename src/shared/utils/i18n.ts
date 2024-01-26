import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getI18nProps = async (
  locale: string | undefined,
  ns: string[] = [],
) => {
  // eslint-disable-next-line
  console.log('asdf asdf getI18nProps local: ', locale);
  // eslint-disable-next-line
  console.log('asdf asdf getI18nProps ns: ', ns);

  const result = await serverSideTranslations(locale || 'en', [
    'common',
    ...ns,
  ]);
  // eslint-disable-next-line
  console.log('asdf asdf getI18nProps result: ', result);

  return {
    ...result,
  };
};
