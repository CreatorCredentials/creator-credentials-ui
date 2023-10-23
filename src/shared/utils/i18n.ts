import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getI18nProps = async (
  locale: string | undefined,
  ns: string[] = [],
) => ({
  ...(locale && (await serverSideTranslations(locale, ['common', ...ns]))),
});
