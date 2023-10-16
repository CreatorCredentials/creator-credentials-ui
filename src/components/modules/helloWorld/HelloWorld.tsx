import { useTranslation } from 'next-i18next';
import React from 'react';

export const HelloWorld = () => {
  const { t } = useTranslation('common');

  return <div>{t('hello-world')}</div>;
};
