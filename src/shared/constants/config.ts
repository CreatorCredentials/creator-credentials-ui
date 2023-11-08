import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const config = {
  API_URL: publicRuntimeConfig.API_URL || 'http://localhost:3000/api',
  API_MOCKING: publicRuntimeConfig.API_MOCKING || 'disabled',
  TERMS_AND_CONDITIONS_URL: 'https://creatorcredentials.com',
};
