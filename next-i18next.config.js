module.exports = {
  debug:
    process.env.NODE_ENV === 'development' &&
    process.env.DEBUG_I18N === 'enabled',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  fallbackLng: {
    default: ['en'],
  },
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
