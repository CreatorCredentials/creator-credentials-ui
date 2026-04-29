const readEnv = (key: string, fallback: string) => process.env[key] || fallback;

export const config = {
  API_URL: readEnv('API_URL', 'http://localhost:3001/api'),
  API_MOCKING: readEnv('API_MOCKING', 'disabled'),
  TERMS_AND_CONDITIONS_URL: 'https://creatorcredentials.com',
  NEST_API_URL: readEnv('NEST_API_URL', 'https://localhost:3200'),
  NEST_API_SSR_URL: readEnv('NEST_API_SSR_URL', 'https://localhost:3200'),
  NEXTAUTH_URL: readEnv('NEXTAUTH_URL', 'http://localhost:3000'),
  DISABLE_I18N_TRANSLATIONS: process.env.DISABLE_I18N_TRANSLATIONS === 'true',
};
