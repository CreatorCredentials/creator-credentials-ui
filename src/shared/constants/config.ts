const readRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`[config] Missing required environment variable: ${key}`);
  }

  return value;
};

export const config = {
  API_URL: readRequiredEnv('API_URL'),
  API_MOCKING: process.env.API_MOCKING || 'disabled',
  TERMS_AND_CONDITIONS_URL: 'https://creatorcredentials.com',
  NEST_API_URL: readRequiredEnv('NEST_API_URL'),
  NEST_API_SSR_URL: readRequiredEnv('NEST_API_SSR_URL'),
  NEXTAUTH_URL: readRequiredEnv('NEXTAUTH_URL'),
  DISABLE_I18N_TRANSLATIONS: process.env.DISABLE_I18N_TRANSLATIONS === 'true',
};
