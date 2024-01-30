import { useTranslation as i18nUseTranslation } from 'next-i18next';
import { config } from '../constants/config';
import { customTranslator } from './customTranslator';

function disabledUseTranslation() {
  return {
    t: customTranslator,
  };
}

export const useTranslation = config.DISABLE_I18N_TRANSLATIONS
  ? disabledUseTranslation
  : i18nUseTranslation;
