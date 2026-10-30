import '@testing-library/jest-dom/vitest';
import { createElement } from 'react';
import { vi } from 'vitest';
// import { server } from './src/mocks/server';

vi.mock('next-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

vi.mock('./src/shared/utils/useTranslation', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

// The axios instances read their base URL when they are created.
vi.stubEnv('NEST_API_URL', 'http://localhost:3100');
vi.stubEnv('NEST_API_SSR_URL', 'http://localhost:3100');

// Icons are loaded through next/dynamic and SVGR, which jsdom cannot resolve.
vi.mock('./src/components/shared/Icon', () => ({
  Icon: ({ icon }: { icon: string }) =>
    createElement('i', { 'data-icon': icon, 'aria-hidden': 'true' }),
}));

vi.mock('next/config', () => ({
  default: () => ({
    publicRuntimeConfig: {
      API_URL: 'http://localhost:3000/api',
      MOCK_API_URL: 'disabled',
    },
  }),
}));

// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterAll(() => server.close());
// afterEach(() => server.resetHandlers());
