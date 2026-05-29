const path = require('path');
const i18nConfig = require('./next-i18next.config');

const i18n = {
  defaultLocale: i18nConfig.i18n.defaultLocale,
  locales: i18nConfig.i18n.locales,
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  typescript: {
    tsconfigPath: './tsconfig.build.json',
  },
  turbopack: {
    root: path.join(__dirname),
  },
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL,
    API_MOCKING: process.env.API_MOCKING || 'enabled',
    NEST_API_URL: process.env.NEST_API_URL,
    NEXT_PUBLIC_NEST_API_URL:
      process.env.NEXT_PUBLIC_NEST_API_URL || process.env.NEST_API_URL,
    NEST_API_SSR_URL: process.env.NEST_API_SSR_URL,
    NEXT_PUBLIC_NEST_API_SSR_URL:
      process.env.NEXT_PUBLIC_NEST_API_SSR_URL || process.env.NEST_API_SSR_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_NEXTAUTH_URL:
      process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    DISABLE_I18N_TRANSLATIONS: process.env.DISABLE_I18N_TRANSLATIONS,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
          },
        },
      ],
    });
    return config;
  },
  i18n,
};

module.exports = nextConfig;
