import { mkdirSync, writeFileSync } from 'node:fs';
import { clerk, clerkSetup } from '@clerk/testing/playwright';
import { expect, test as setup } from '@playwright/test';
import {
  authStateDir,
  authStatePath,
  credentialsFor,
  missingAuthMessage,
  Role,
  ROLES,
} from './fixtures/env';

const HOME_PATH: Record<Role, string> = {
  issuer: '/issuer',
  creator: '/creator',
  admin: '/admin/credentials',
};
const CLERK_LOADED_PATH = '/welcome';
const EMPTY_STORAGE_STATE = { cookies: [], origins: [] };

const anyRoleConfigured = ROLES.some((role) => credentialsFor(role) !== null);

const writeEmptyStorageState = (role: Role): void => {
  mkdirSync(authStateDir(), { recursive: true });
  writeFileSync(authStatePath(role), JSON.stringify(EMPTY_STORAGE_STATE));
};

setup.beforeAll(async () => {
  if (anyRoleConfigured) {
    await clerkSetup();
  }
});

for (const role of ROLES) {
  setup(`sign in as ${role}`, async ({ page }) => {
    const credentials = credentialsFor(role);
    if (!credentials) {
      writeEmptyStorageState(role);
      setup.skip(true, missingAuthMessage(role));
      return;
    }

    await page.goto(CLERK_LOADED_PATH);
    await clerk.signIn({
      page,
      signInParams: { strategy: 'password', ...credentials },
    });

    await page.goto(HOME_PATH[role]);
    await expect(
      page,
      `the ${role} test user must carry publicMetadata.role for ${HOME_PATH[role]}`,
    ).toHaveURL(new RegExp(`${HOME_PATH[role]}$`));

    mkdirSync(authStateDir(), { recursive: true });
    await page.context().storageState({ path: authStatePath(role) });
  });
}
