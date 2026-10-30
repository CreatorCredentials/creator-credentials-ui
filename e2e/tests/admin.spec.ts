import { expect, test } from '@playwright/test';
import { ApiState } from '../fixtures/apiState';
import { ADMIN_USERS, GLOBEX_ISSUER } from '../fixtures/data/admin';
import {
  ALICE_MEMBERSHIP_ID,
  ALICE_REVOKED_MEMBERSHIP_ID,
  ALICE_REVOKED_REASON,
  BOB_MEMBERSHIP_ID,
  ISSUED_RECORDS,
  jwtFor,
  TAMPERED_JWT,
} from '../fixtures/data/credentials';
import {
  ADMIN_NAME,
  CREATOR_ALICE,
  CREATOR_BOB,
  CREATOR_CAROL,
  ISSUER_NAME,
} from '../fixtures/data/users';
import { mockApi } from '../fixtures/mockApi';
import { requireAuth, requireMockedApi } from '../fixtures/skips';
import { TestId } from '../fixtures/testIds';
import { AdminCredentialsPage } from '../pages/adminCredentialsPage';
import { AdminVerifyPage } from '../pages/adminVerifyPage';

const ALICE = CREATOR_ALICE.email ?? '';
const BOB = CREATOR_BOB.email ?? '';
const CAROL = CREATOR_CAROL.email ?? '';

const REVOKE_SUCCESS_TOAST = 'Credential revoked.';
const REVOKE_ERROR_TOAST =
  'Failed to revoke the credential. Please try again later.';
const REVOKE_REASON = 'Terms of service breach';
const STATS_PATH = '/v1/admin/stats';

const aliceCredentialObject = ISSUED_RECORDS.find(
  (record) => record.credential.id === ALICE_MEMBERSHIP_ID,
)?.credential.data.credentialObject;

const issuedBy = (issuerName: string) =>
  ADMIN_USERS.find((user) => user.organizationName === issuerName)?.counts
    .issuedCredentials;

requireAuth('admin');
requireMockedApi();

test.describe('admin: credentials', () => {
  let api: ApiState;
  let adminPage: AdminCredentialsPage;

  test.beforeEach(async ({ page }) => {
    api = await mockApi(page, { role: 'admin' });
    adminPage = new AdminCredentialsPage(page);
    await adminPage.goto();
  });

  test('A1 lists issued credentials of every issuer, newest first, with the stats strip', async ({
    page,
  }) => {
    await expect(adminPage.table()).toBeVisible();
    await expect(adminPage.rows).toHaveCount(4);
    await expect(adminPage.rows.nth(0)).toContainText(BOB);
    await expect(adminPage.rows.nth(0)).toContainText(ISSUER_NAME);
    await expect(adminPage.rows.nth(1)).toContainText(GLOBEX_ISSUER.name ?? '');
    await expect(adminPage.rows.nth(2)).toContainText(ALICE);
    await expect(adminPage.rows.nth(3)).toContainText(CAROL);
    await expect(adminPage.paginationSummary()).toHaveText('1–4 of 4');
    await expect(page.getByTestId(TestId.adminStats)).toContainText('Users');
    await expect(
      adminPage.table().getByRole('button', { name: /^accept$/i }),
    ).toHaveCount(0);
  });

  test('A2 status chips, type and issuer selects narrow the server-side list', async () => {
    await adminPage.showStatus('revoked');
    await expect(adminPage.rows).toHaveCount(1);
    await expect(adminPage.rows.first()).toContainText(ALICE);
    await expect(adminPage.rows.first()).toContainText('Revoked');

    await adminPage.showStatus('pending');
    await expect(adminPage.rows).toHaveCount(1);
    await expect(adminPage.rows.first()).toContainText('Pending');
    await expect(
      adminPage.rows.first().getByTestId(TestId.adminRevoke),
    ).toHaveCount(0);
    await expect(
      adminPage.rows.first().getByTestId(TestId.adminDownload),
    ).toHaveCount(0);

    await adminPage.showStatus('success');
    await adminPage.filterIssuer(GLOBEX_ISSUER.name ?? '');
    await expect(adminPage.rows).toHaveCount(1);
    await expect(adminPage.rows.first()).toContainText(BOB);
    expect(
      api.countCalls(
        'GET',
        `/v1/admin/credentials?status=SUCCESS&issuerId=${GLOBEX_ISSUER.id}&page=1&pageSize=20`,
      ),
    ).toBe(1);

    await adminPage.filterIssuer('All issuers');
    await adminPage.filterType('DATASUPPLIER');
    await expect(adminPage.rows).toHaveCount(1);
    await expect(adminPage.rows.first()).toContainText(CAROL);
  });

  test('A3 search is debounced and sent to the API as q', async () => {
    await adminPage.search('bob');

    await expect(adminPage.rows).toHaveCount(2);
    await expect(adminPage.rows.nth(0)).toContainText(BOB);
    await expect(adminPage.rows.nth(1)).toContainText(BOB);
    expect(
      api.countCalls(
        'GET',
        '/v1/admin/credentials?status=SUCCESS&q=bob&page=1&pageSize=20',
      ),
    ).toBe(1);
    expect(
      api.calls.filter((call) => call.path.includes('q=bo&')),
    ).toHaveLength(0);

    await adminPage.search('nobody');
    await expect(adminPage.emptyState()).toHaveText(
      'No credentials match these filters.',
    );
  });

  test('A4 view opens the details with creator, issuer, status-list entry and the credential object', async () => {
    await adminPage.openDetails(ALICE);

    const modal = adminPage.detailsModal;
    await expect(modal).toContainText(CREATOR_ALICE.name ?? '');
    await expect(modal).toContainText(CREATOR_ALICE.didKey);
    await expect(modal).toContainText(ISSUER_NAME);
    await expect(modal).toContainText('Index 1');
    await expect(modal.getByTestId(TestId.adminCredentialObject)).toContainText(
      `urn:uuid:e2e-${ALICE_MEMBERSHIP_ID}`,
    );
    await adminPage.closeDetails();

    await adminPage.showStatus('revoked');
    await adminPage.openDetails(ALICE);
    await expect(modal.getByTestId(TestId.adminNoStatusEntry)).toBeVisible();
    await expect(modal).toContainText(`Reason`);
    await expect(modal).toContainText(ALICE_REVOKED_REASON);
  });

  test('A5 download saves the credential object as JSON', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await adminPage.openMenu(ALICE);
    await page.getByTestId(TestId.adminDownload).click();
    const download = await downloadPromise;

    // Browsers replace the colons of the ISO timestamp in file names.
    expect(download.suggestedFilename()).toBe(
      `${ISSUER_NAME} ${aliceCredentialObject?.validFrom}.json`.replace(
        /:/g,
        '_',
      ),
    );
  });

  test('A6 revoke with a reason notifies, moves the row to Revoked and refreshes the stats', async () => {
    const statsCallsBefore = api.countCalls('GET', STATS_PATH);

    await adminPage.openRevokeDialog(BOB);
    await adminPage.confirmRevoke(REVOKE_REASON);

    await expect(adminPage.toast(REVOKE_SUCCESS_TOAST)).toBeVisible();
    await expect(adminPage.rows).toHaveCount(3);
    expect(
      api.countCalls(
        'POST',
        `/v1/admin/credentials/${BOB_MEMBERSHIP_ID}/revoke`,
      ),
    ).toBe(1);
    await expect
      .poll(() => api.countCalls('GET', STATS_PATH))
      .toBeGreaterThan(statsCallsBefore);

    await adminPage.showStatus('revoked');
    await expect(adminPage.rows).toHaveCount(2);
    await adminPage.openDetails(BOB);
    await expect(adminPage.detailsModal).toContainText(REVOKE_REASON);
    await expect(adminPage.detailsModal).toContainText(`${ADMIN_NAME} (admin)`);
  });

  test('A6 cancelling the revoke dialog changes nothing', async ({ page }) => {
    await adminPage.openRevokeDialog(BOB);
    await page.getByTestId(TestId.adminRevokeCancel).click();

    await expect(adminPage.revokeModal).toHaveCount(0);
    await expect(adminPage.rows).toHaveCount(4);
    expect(
      api.calls.filter(
        (call) => call.method === 'POST' && call.path.endsWith('/revoke'),
      ),
    ).toHaveLength(0);
  });

  test('A7 a failing revoke shows an error toast and keeps the dialog and the list', async ({
    page,
  }) => {
    api.flags.failRevoke = true;

    await adminPage.openRevokeDialog(BOB);
    await adminPage.confirmRevoke(REVOKE_REASON);

    await expect(adminPage.toast(REVOKE_ERROR_TOAST)).toBeVisible();
    await expect(adminPage.revokeModal).toBeVisible();
    await expect(page.getByTestId(TestId.adminRevokeReason)).toHaveValue(
      REVOKE_REASON,
    );
    await page.getByTestId(TestId.adminRevokeCancel).click();
    await expect(adminPage.rows).toHaveCount(4);
  });

  test('A8 users page lists issuers with counts and links to their credentials', async ({
    page,
  }) => {
    await page.goto('/admin/users');

    const rows = page.getByTestId(TestId.adminUserRow);
    await expect(rows).toHaveCount(2);
    const globexRow = rows.filter({ hasText: GLOBEX_ISSUER.name ?? '' });
    await expect(globexRow).toContainText(GLOBEX_ISSUER.domain ?? '');
    await expect(globexRow).toContainText(
      String(issuedBy(GLOBEX_ISSUER.name ?? '')),
    );

    await page.getByTestId('admin-users-role-creator').click();
    await expect(rows).toHaveCount(3);
    await expect(rows.first()).toContainText(ALICE);

    await page.getByTestId('admin-users-role-issuer').click();
    await globexRow.getByTestId(TestId.adminUserMenu).click();
    await page.getByTestId(TestId.adminUserCredentials).click();

    await expect(page).toHaveURL(/\/admin\/credentials\?issuerId=2$/);
    await expect(adminPage.rows).toHaveCount(1);
    await expect(adminPage.rows.first()).toContainText(BOB);
    await expect(adminPage.rows.first()).toContainText(
      GLOBEX_ISSUER.name ?? '',
    );
  });

  test('A8 the pending request is never offered to accept or sign', async () => {
    await adminPage.showStatus('pending');

    await expect(adminPage.rows).toHaveCount(1);
    await expect(adminPage.table()).not.toContainText(/accept|sign/i);
  });
});

test.describe('admin: verify', () => {
  let verifyPage: AdminVerifyPage;

  test.beforeEach(async ({ page }) => {
    await mockApi(page, { role: 'admin' });
    verifyPage = new AdminVerifyPage(page);
    await verifyPage.goto();
  });

  test('A9 a valid JWT passes the three checks', async () => {
    await verifyPage.verify(jwtFor(ALICE_MEMBERSHIP_ID));

    await expect(verifyPage.result).toHaveAttribute('data-valid', 'true');
    await expect(verifyPage.result).toContainText('Valid credential');
    for (const check of ['signature', 'validity', 'revocation'] as const) {
      await expect(verifyPage.check(check)).toHaveAttribute(
        'data-outcome',
        'passed',
      );
    }
    await expect(verifyPage.check('signature')).toContainText(
      'did:web:acme-publishing.test',
    );
  });

  test('A9 a credential JSON with its proof is accepted as input', async () => {
    await verifyPage.verify(JSON.stringify(aliceCredentialObject));

    await expect(verifyPage.result).toHaveAttribute('data-valid', 'true');
    await verifyPage.rawResponse().locator('summary').click();
    await expect(verifyPage.rawResponse()).toContainText(
      `urn:uuid:e2e-${ALICE_MEMBERSHIP_ID}`,
    );
  });

  test('A10 a revoked credential fails on revocation while its signature holds', async () => {
    await verifyPage.verify(jwtFor(ALICE_REVOKED_MEMBERSHIP_ID));

    await expect(verifyPage.result).toHaveAttribute('data-valid', 'false');
    await expect(verifyPage.result).toContainText('Invalid credential');
    await expect(verifyPage.check('signature')).toHaveAttribute(
      'data-outcome',
      'passed',
    );
    await expect(verifyPage.check('revocation')).toHaveAttribute(
      'data-outcome',
      'revoked',
    );
  });

  test('A10 a tampered JWT fails the signature check', async () => {
    await verifyPage.verify(TAMPERED_JWT);

    await expect(verifyPage.result).toHaveAttribute('data-valid', 'false');
    await expect(verifyPage.check('signature')).toHaveAttribute(
      'data-outcome',
      'failed',
    );
  });

  test('A10 malformed JSON is rejected before any request', async ({
    page,
  }) => {
    await verifyPage.verify('{"proof":');

    await expect(
      page.getByText('The input is not a valid credential JSON.'),
    ).toBeVisible();
    await expect(verifyPage.result).toHaveCount(0);
  });
});
