import { expect, test } from '../fixtures/pageHealth';
import { requireAuth, requireRealApi } from '../fixtures/skips';
import { CreatorCredentialsPage } from '../pages/creatorCredentialsPage';

requireAuth('creator');
requireRealApi();

test.describe('creator: smoke against the real backend', () => {
  test('/creator renders the hub cards', async ({ page, health }) => {
    await page.goto('/creator');

    await expect(
      page.getByRole('heading', {
        name: 'Welcome to the Creator Hub',
        level: 1,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Start managing your digital creator identity',
      }),
    ).toBeVisible();
    await health.expectHealthy();
  });

  test('/creator/credentials shows the credential tabs with the issued panel', async ({
    page,
    health,
  }) => {
    const credentialsPage = new CreatorCredentialsPage(page);
    await credentialsPage.goto();

    await expect(
      page.getByRole('heading', { name: 'Your credentials', level: 1 }),
    ).toBeVisible();
    await expect(credentialsPage.activePanel()).toBeVisible();
    await health.expectHealthy();
  });

  test('/creator/issuers lists the issuers by connection status', async ({
    page,
    health,
  }) => {
    await page.goto('/creator/issuers');

    await expect(
      page.getByRole('heading', { name: 'Your issuers', level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);
    await expect(page.getByRole('tab').first()).toBeVisible();
    await expect(page.getByRole('tabpanel')).toBeVisible();
    await health.expectHealthy();
  });
});
