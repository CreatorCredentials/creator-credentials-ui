import { expect, test } from '@playwright/test';
import { ApiState } from '../fixtures/apiState';
import {
  AVAILABLE_ISSUER_ID,
  AVAILABLE_ISSUER_NAME,
  CONNECTED_ISSUER_ID,
} from '../fixtures/data/issuers';
import { MEMBER_TEMPLATE_NAME } from '../fixtures/data/templates';
import { ISSUER_NAME } from '../fixtures/data/users';
import { mockApi } from '../fixtures/mockApi';
import {
  requireAuth,
  requireMockedApi,
  requireRealApi,
} from '../fixtures/skips';

const SUCCESS_TITLE = 'Your request has been sent';

requireAuth('creator');

test.describe('creator: credential request flow', () => {
  let api: ApiState;

  test.beforeEach(async ({ page }) => {
    requireMockedApi();
    api = await mockApi(page, { role: 'creator' });
  });

  test('C4 selecting a credential type and an issuer reaches the confirmation step and sends the request', async ({
    page,
  }) => {
    await page.goto('/creator/credentials/new');

    await expect(page.getByText(MEMBER_TEMPLATE_NAME)).toBeVisible();
    await page.getByRole('button', { name: 'Select', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    await expect(page.getByText(ISSUER_NAME)).toBeVisible();
    await page.getByRole('button', { name: 'Select', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    await expect(
      page.getByText('You request the following credential:'),
    ).toBeVisible();
    await expect(page.getByText(MEMBER_TEMPLATE_NAME)).toBeVisible();
    await expect(page.getByText(ISSUER_NAME)).toBeVisible();
    const confirm = page.getByRole('button', { name: 'Confirm', exact: true });
    await expect(confirm).toBeEnabled();

    await confirm.click();
    await expect(
      page.getByRole('heading', { name: SUCCESS_TITLE }),
    ).toBeVisible();
    expect(api.credentialRequests).toHaveLength(1);
    expect(api.credentialRequests[0]).toMatchObject({
      issuerId: CONNECTED_ISSUER_ID,
      credentialType: 'MEMBER',
    });
  });
});

test.describe('creator: issuers', () => {
  test('C5 the available issuer offers a connect action leading to the request page', async ({
    page,
  }) => {
    requireMockedApi();
    await mockApi(page, { role: 'creator' });
    await page.goto('/creator/issuers');

    await page.getByRole('tab', { name: 'Available' }).click();
    const panel = page.getByRole('tabpanel');
    await expect(panel.getByText(AVAILABLE_ISSUER_NAME)).toBeVisible();
    await expect(
      panel.getByRole('link', { name: 'Connect', exact: true }),
    ).toHaveAttribute(
      'href',
      `/creator/issuers/request?issuerId=${AVAILABLE_ISSUER_ID}`,
    );
  });

  test('C5 sending a connection request shows the confirmation card', async ({
    page,
  }) => {
    // `/creator/issuers/request` is server-rendered from the backend, which
    // Playwright cannot intercept, so this part needs a reachable backend.
    requireRealApi();
    await page.goto('/creator/issuers');

    await page.getByRole('tab', { name: 'Available' }).click();
    await page
      .getByRole('tabpanel')
      .getByRole('link', { name: 'Connect', exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/creator\/issuers\/request\?issuerId=/);

    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: SUCCESS_TITLE }),
    ).toBeVisible();
  });
});
