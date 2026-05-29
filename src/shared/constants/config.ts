const requireEnv = (
  value: string | undefined,
  primaryKey: string,
  publicKey?: string,
): string => {
  if (!value) {
    throw new Error(
      `[config] Missing required environment variable: ${primaryKey}${
        publicKey ? ` (or ${publicKey})` : ''
      }`,
    );
  }

  return value;
};

export const config = {
  get API_URL(): string {
    return requireEnv(
      process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
      'API_URL',
      'NEXT_PUBLIC_API_URL',
    );
  },
  get API_MOCKING(): string {
    return process.env.API_MOCKING || 'disabled';
  },
  TERMS_AND_CONDITIONS_URL: 'https://creatorcredentials.com',
  get NEST_API_URL(): string {
    return requireEnv(
      process.env.NEST_API_URL || process.env.NEXT_PUBLIC_NEST_API_URL,
      'NEST_API_URL',
      'NEXT_PUBLIC_NEST_API_URL',
    );
  },
  get NEST_API_SSR_URL(): string {
    return requireEnv(
      process.env.NEST_API_SSR_URL || process.env.NEXT_PUBLIC_NEST_API_SSR_URL,
      'NEST_API_SSR_URL',
      'NEXT_PUBLIC_NEST_API_SSR_URL',
    );
  },
  get NEXTAUTH_URL(): string {
    return requireEnv(
      process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_NEXTAUTH_URL,
      'NEXTAUTH_URL',
      'NEXT_PUBLIC_NEXTAUTH_URL',
    );
  },
  get DISABLE_I18N_TRANSLATIONS(): boolean {
    return process.env.DISABLE_I18N_TRANSLATIONS === 'true';
  },
};
