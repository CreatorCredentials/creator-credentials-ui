import { test } from '@playwright/test';
import { hasAuth, isRealApi, missingAuthMessage, Role } from './env';

/** Skips the enclosing file or describe block when the role has no Clerk test user configured. */
export const requireAuth = (role: Role): void => {
  test.skip(!hasAuth(role), missingAuthMessage(role));
};

/** Skips scenarios whose assertions are bound to the mocked fixture data. */
export const requireMockedApi = (): void => {
  test.skip(
    isRealApi(),
    'asserts against mocked fixtures; run without E2E_API=real',
  );
};

/** Skips scenarios that need the real backend behind the Next.js server. */
export const requireRealApi = (): void => {
  test.skip(
    !isRealApi(),
    'needs a backend reachable by the Next.js server; run with E2E_API=real',
  );
};
