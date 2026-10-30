import viteReact from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [viteReact(), viteTsconfigPaths(), svgr()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
    reporters: 'verbose',
    coverage: {
      reporter: ['text', 'json', 'html', 'cobertura'],
      include: ['./src/**/*.tsx'],
    },
  },
});
