const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.build.json',
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
    API_MOCKING: process.env.API_MOCKING || 'enabled',
  },
  // eslint-disable-next-line require-await
  redirects: async () => [
    {
      source: '/',
      destination: '/home',
      permanent: false,
    },
  ],
  i18n,
};

module.exports = nextConfig;
