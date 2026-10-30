import { defineConfig } from '@playwright/test';
import {
  appBaseUrl,
  appPort,
  authStatePath,
  loadLocalEnv,
  Role,
  ROLES,
} from './e2e/fixtures/env';

loadLocalEnv();

const isCi = Boolean(process.env.CI);
const baseURL = appBaseUrl();

const roleProject = (role: Role) => ({
  name: role,
  testMatch: [`**/${role}-*.spec.ts`, `**/${role}.spec.ts`],
  dependencies: ['setup'],
  use: { storageState: authStatePath(role) },
});

export default defineConfig({
  testDir: 'e2e/tests',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  reporter: isCi
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testDir: 'e2e', testMatch: '**/auth.setup.ts' },
    { name: 'public', testMatch: '**/public.spec.ts' },
    ...ROLES.map(roleProject),
  ],
  webServer: {
    command: 'pnpm start:dev',
    url: baseURL,
    reuseExistingServer: !isCi,
    timeout: 180_000,
    env: { PORT: String(appPort()) },
  },
});
