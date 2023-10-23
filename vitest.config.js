import viteReact from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [viteReact(), viteTsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    testMatch: ['./src/**/*.test.{tsx,ts}'],
    globals: true,
    reporters: 'verbose',
    coverage: {
      reporter: ['text', 'json', 'html', 'cobertura'],
      all: true,
      excludeNodeModules: true,
      include: ['./src/**/*.tsx'],
    },
  },
});
