import { credentialsFor } from '../fixtures/env';
import { expect, test } from '../fixtures/pageHealth';
import { requireAuth, requireRealApi } from '../fixtures/skips';
import { IssuedCredentialsPage } from '../pages/issuedCredentialsPage';

const ISSUER_EMAIL = credentialsFor('issuer')?.identifier ?? '';
const CREATOR_REQUESTS_TITLE = /^(Creator requests|Data supplier requests)$/;

requireAuth('issuer');
requireRealApi();

test.describe('issuer: smoke against the real backend', () => {
  test('/issuer renders the dashboard cards', async ({ page, health }) => {
    await page.goto('/issuer');

    await expect(
      page.getByRole('heading', { name: 'Issuer Portal', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Welcome to your dashboard' }),
    ).toBeVisible();
    await health.expectHealthy();
  });

  test('/issuer/creators lands on the pending connection requests', async ({
    page,
    health,
  }) => {
    await page.goto('/issuer/creators');

    await expect(page).toHaveURL(/\/issuer\/creators\/requested$/);
    await expect(
      page.getByRole('heading', { name: CREATOR_REQUESTS_TITLE, level: 1 }),
    ).toBeVisible();
    // The request grid has no empty state of its own; the spinner leaving is what marks it loaded.
    await expect(page.getByRole('status')).toHaveCount(0);
    await health.expectHealthy();
  });

  test('/issuer/credentials/issued lists the issued credentials or the empty state', async ({
    page,
    health,
  }) => {
    const issuedPage = new IssuedCredentialsPage(page);
    await issuedPage.goto();

    await expect(
      page.getByRole('heading', { name: 'My Issued Credentials', level: 1 }),
    ).toBeVisible();
    await expect(issuedPage.listOrEmptyState()).toBeVisible();
    await expect(issuedPage.errorBanner()).toHaveCount(0);
    await health.expectHealthy();
  });

  test('/issuer/verification shows the verification cards with the signed-in e-mail', async ({
    page,
    health,
  }) => {
    await page.goto('/issuer/verification');

    await expect(
      page.getByRole('heading', { name: 'Issuer verification', level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(ISSUER_EMAIL, { exact: true })).toBeVisible();
    await health.expectHealthy();
  });
});
