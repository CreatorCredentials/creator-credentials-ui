import { expect, test } from '@playwright/test';
import {
  CHALLENGE_CREDENTIAL_TYPE,
  SIGNING_COMMAND,
} from '../fixtures/data/challenge';
import { CREATOR_ALICE, CREATOR_ERIN } from '../fixtures/data/users';
import { mockApi } from '../fixtures/mockApi';
import { requireAuth, requireMockedApi } from '../fixtures/skips';

requireAuth('issuer');
requireMockedApi();

test.describe('issuer: requests', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page, { role: 'issuer' });
  });

  test('I9 reviewing a credential request shows the signing challenge', async ({
    page,
  }) => {
    await page.goto('/issuer/credentials/requested');
    await expect(page.getByText(CREATOR_ALICE.email ?? '')).toBeVisible();

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(CREATOR_ALICE.email ?? '');
    await expect(dialog).toContainText(CHALLENGE_CREDENTIAL_TYPE);
    await expect(dialog).toContainText(SIGNING_COMMAND);
    await expect(
      dialog.getByRole('button', {
        name: 'Verify Signature & Issue Credential',
      }),
    ).toBeDisabled();
  });

  test('I10 a pending connection request is listed with accept and reject', async ({
    page,
  }) => {
    await page.goto('/issuer/creators/requested');

    await expect(page.getByText(CREATOR_ERIN.email ?? '')).toBeVisible();
    await expect(page.getByText(CREATOR_ERIN.name ?? '')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Accept', exact: true }),
    ).toHaveCount(1);
    await expect(
      page.getByRole('button', { name: 'Reject', exact: true }),
    ).toHaveCount(1);
  });
});
