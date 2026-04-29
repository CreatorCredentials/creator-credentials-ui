const { i18n } = require('./next-i18next.config');

const assertClerkEnv = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  const missing = [];
  if (!publishableKey) missing.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  if (!secretKey) missing.push('CLERK_SECRET_KEY');

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required Clerk variables: ${missing.join(', ')}.`,
    );
  }

  const placeholderValues = new Set(['x', 'X', 'changeme', 'your_value_here']);
  if (
    placeholderValues.has(publishableKey.trim()) ||
    placeholderValues.has(secretKey.trim())
  ) {
    throw new Error(
      '[env] Clerk variables contain placeholder values. Set real NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY.',
    );
  }

  if (!publishableKey.startsWith('pk_')) {
    throw new Error(
      '[env] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with "pk_".',
    );
  }

  if (!secretKey.startsWith('sk_')) {
    throw new Error('[env] CLERK_SECRET_KEY must start with "sk_".');
  }
};

assertClerkEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.build.json',
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
    API_MOCKING: process.env.API_MOCKING || 'enabled',
    NEST_API_URL: process.env.NEST_API_URL,
    NEST_API_SSR_URL: process.env.NEST_API_SSR_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISABLE_I18N_TRANSLATIONS: process.env.DISABLE_I18N_TRANSLATIONS,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
    API_MOCKING: process.env.API_MOCKING || 'enabled',
    NEST_API_URL: process.env.NEST_API_URL,
    NEST_API_SSR_URL: process.env.NEST_API_SSR_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    DISABLE_I18N_TRANSLATIONS: process.env.DISABLE_I18N_TRANSLATIONS,
  },
  webpack(config) {
    // Fixes npm packages that depend on `fs` module
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
