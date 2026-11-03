import { backendUrl } from '../fixtures/env';
import { expect, test } from '../fixtures/pageHealth';
import { requireAuth, requireRealApi } from '../fixtures/skips';
import { TestId } from '../fixtures/testIds';
import { AdminCredentialsPage } from '../pages/adminCredentialsPage';
import { AdminUsersPage } from '../pages/adminUsersPage';
import { AdminVerifyPage } from '../pages/adminVerifyPage';

const STATUS_LIST_PATH = '/v1/status-lists/1';
const REVOKED_CREDENTIALS_PATH = '/v1/revoked-credentials';

requireAuth('admin');
requireRealApi();

test.describe('admin: smoke against the real backend', () => {
  test('/admin/credentials shows the stats strip and the credentials table', async ({
    page,
    health,
  }) => {
    const adminPage = new AdminCredentialsPage(page);
    await adminPage.goto();

    await expect(
      page.getByRole('heading', { name: 'All credentials', level: 1 }),
    ).toBeVisible();
    await expect(adminPage.statsStrip()).toBeVisible();
    await expect(adminPage.listOrEmptyState()).toBeVisible();
    await expect(page.getByTestId(TestId.adminErrorBanner)).toHaveCount(0);
    await health.expectHealthy();
  });

  test('/admin/credentials links the public revocation lists of the backend under test', async ({
    page,
  }) => {
    const adminPage = new AdminCredentialsPage(page);
    await adminPage.goto();

    await expect(adminPage.statusListLink()).toHaveAttribute(
      'href',
      `${backendUrl()}${STATUS_LIST_PATH}`,
    );
    await expect(adminPage.revokedCredentialsLink()).toHaveAttribute(
      'href',
      `${backendUrl()}${REVOKED_CREDENTIALS_PATH}`,
    );
  });

  test('/admin/users lists the registered issuers', async ({
    page,
    health,
  }) => {
    const usersPage = new AdminUsersPage(page);
    await usersPage.goto();

    await expect(
      page.getByRole('heading', { name: 'Users', level: 1 }),
    ).toBeVisible();
    await expect(usersPage.listOrEmptyState()).toBeVisible();
    await health.expectHealthy();
  });

  test('/admin/verify renders the verification form', async ({
    page,
    health,
  }) => {
    const verifyPage = new AdminVerifyPage(page);
    await verifyPage.goto();

    await expect(
      page.getByRole('heading', { name: 'Verify a credential', level: 1 }),
    ).toBeVisible();
    await expect(page.getByTestId(TestId.adminVerifySubmit)).toBeEnabled();
    await health.expectHealthy();
  });
});
