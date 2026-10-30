import { expect, test } from '@playwright/test';
import { ApiState } from '../fixtures/apiState';
import {
  ALICE_REVOKED_REASON,
  BOB_MEMBERSHIP_ID,
} from '../fixtures/data/credentials';
import {
  CREATOR_ALICE,
  CREATOR_BOB,
  CREATOR_CAROL,
} from '../fixtures/data/users';
import { mockApi } from '../fixtures/mockApi';
import { requireAuth, requireMockedApi } from '../fixtures/skips';
import { TestId } from '../fixtures/testIds';
import { IssuedCredentialsPage } from '../pages/issuedCredentialsPage';

const ALICE = CREATOR_ALICE.email ?? '';
const BOB = CREATOR_BOB.email ?? '';
const CAROL = CREATOR_CAROL.email ?? '';

const NEWEST_FIRST = [BOB, ALICE, CAROL];
const OLDEST_FIRST = [CAROL, ALICE, BOB];
const NAME_ASCENDING = [ALICE, BOB, CAROL];
const NAME_DESCENDING = [CAROL, BOB, ALICE];
const ISSUED_LIST_PATH = '/v1/credentials/issuers?status=SUCCESS';

const REVOKE_SUCCESS_TOAST = 'Credential revoked.';
const REVOKE_ERROR_TOAST =
  'Failed to revoke the credential. Please try again later.';
const REVOKE_REASON = 'Contract terminated';

requireAuth('issuer');
requireMockedApi();

test.describe('issuer: issued credentials', () => {
  let api: ApiState;
  let issuedPage: IssuedCredentialsPage;

  test.beforeEach(async ({ page }) => {
    api = await mockApi(page, { role: 'issuer' });
    issuedPage = new IssuedCredentialsPage(page);
    await issuedPage.goto();
  });

  test('I1 lists issued credentials with the full creator e-mail on every card', async () => {
    await expect(issuedPage.cards).toHaveCount(3);
    await expect(issuedPage.cardEmails()).toHaveText(NEWEST_FIRST);
  });

  test('I2 search narrows by e-mail, name, DID fragment and type label; clearing restores', async () => {
    await issuedPage.search('bob@');
    await expect(issuedPage.cardEmails()).toHaveText([BOB]);

    await issuedPage.search('alice');
    await expect(issuedPage.cardEmails()).toHaveText([ALICE]);

    await issuedPage.search('zDnaeCarol');
    await expect(issuedPage.cardEmails()).toHaveText([CAROL]);

    await issuedPage.search('Open Future');
    await expect(issuedPage.cardEmails()).toHaveText([CAROL]);

    await issuedPage.search('member');
    await expect(issuedPage.cardEmails()).toHaveText([BOB, ALICE]);

    await issuedPage.search('nobody matches this');
    await expect(issuedPage.emptyState()).toHaveText(
      'No credentials match your search.',
    );

    await issuedPage.search('');
    await expect(issuedPage.cardEmails()).toHaveText(NEWEST_FIRST);
  });

  test('I3 sorting reorders the grid without refetching', async () => {
    const listRequestsBefore = api.countCalls('GET', ISSUED_LIST_PATH);

    await issuedPage.sortBy('Name A–Z');
    await expect(issuedPage.cardEmails()).toHaveText(NAME_ASCENDING);

    await issuedPage.sortBy('Name Z–A');
    await expect(issuedPage.cardEmails()).toHaveText(NAME_DESCENDING);

    await issuedPage.sortBy('Oldest first');
    await expect(issuedPage.cardEmails()).toHaveText(OLDEST_FIRST);

    await issuedPage.sortBy('Newest first');
    await expect(issuedPage.cardEmails()).toHaveText(NEWEST_FIRST);

    expect(api.countCalls('GET', ISSUED_LIST_PATH)).toBe(listRequestsBefore);
  });

  test('I4 table view shows one row per credential with e-mail, type, issued date and status', async () => {
    await issuedPage.switchView('table');

    await expect(issuedPage.rows).toHaveCount(3);
    await expect(issuedPage.rowEmails()).toHaveText(NEWEST_FIRST);

    const bobRow = issuedPage.rowWithEmail(BOB);
    await expect(bobRow).toContainText('Member');
    await expect(bobRow).toContainText('05 Oct 2026');
    await expect(bobRow).toContainText('Accepted');

    const carolRow = issuedPage.rowWithEmail(CAROL);
    await expect(carolRow).toContainText('Open Future Data Supplier');
    await expect(carolRow).toContainText('15 Mar 2026');
    await expect(
      carolRow.getByTestId(TestId.connectionRevokedMarker),
    ).toBeVisible();
  });

  test('I5 revoke with a reason shows a toast, leaves Issued and appears under Revoked with the reason', async () => {
    await issuedPage.openRevokeDialog(BOB);
    await issuedPage.confirmRevoke(REVOKE_REASON);

    await expect(issuedPage.toast(REVOKE_SUCCESS_TOAST)).toBeVisible();
    await expect(issuedPage.cardEmails()).toHaveText([ALICE, CAROL]);
    await expect(issuedPage.errorBanner()).toHaveCount(0);

    await issuedPage.showStatus('revoked');
    await expect(issuedPage.cardEmails()).toHaveText([BOB, ALICE]);
    const bobCard = issuedPage.cardWithEmail(BOB);
    await expect(bobCard).toContainText('Revoked');
    await expect(bobCard).toContainText(`Reason: ${REVOKE_REASON}`);
    await expect(issuedPage.cardWithEmail(ALICE)).toContainText(
      `Reason: ${ALICE_REVOKED_REASON}`,
    );
  });

  test('I5 cancelling the dialog revokes nothing', async ({ page }) => {
    await issuedPage.openRevokeDialog(BOB);
    await page.getByTestId(TestId.revokeCancel).click();

    await expect(page.getByTestId(TestId.revokeModal)).toHaveCount(0);
    await expect(issuedPage.cardEmails()).toHaveText(NEWEST_FIRST);
    expect(
      api.countCalls('POST', `/v1/credentials/${BOB_MEMBERSHIP_ID}/revoke`),
    ).toBe(0);
  });

  test('I6 a failing revoke shows an error toast and leaves the grid unchanged', async () => {
    api.flags.failRevoke = true;

    await issuedPage.openRevokeDialog(BOB);
    await issuedPage.confirmRevoke(REVOKE_REASON);

    await expect(issuedPage.toast(REVOKE_ERROR_TOAST)).toBeVisible();
    await expect(issuedPage.cardEmails()).toHaveText(NEWEST_FIRST);
    await issuedPage.showStatus('revoked');
    await expect(issuedPage.cardEmails()).toHaveText([ALICE]);
  });

  test('I7 a failing list refetch keeps the cached grid and shows an inline banner', async () => {
    await issuedPage.showStatus('revoked');
    await expect(issuedPage.cardEmails()).toHaveText([ALICE]);

    api.flags.failIssuedList = true;
    await issuedPage.showStatus('success');

    await expect(issuedPage.errorBanner()).toHaveText(
      'There was an error fetching your credentials. Please try again later.',
    );
    await expect(issuedPage.cardEmails()).toHaveText(NEWEST_FIRST);
    await expect(issuedPage.emptyState()).toHaveCount(0);
  });

  test('I8 a credential whose connection was revoked is listed with the marker', async () => {
    const markers = issuedPage.cards.getByTestId(
      TestId.connectionRevokedMarker,
    );

    await expect(markers).toHaveCount(1);
    await expect(
      issuedPage
        .cardWithEmail(CAROL)
        .getByTestId(TestId.connectionRevokedMarker),
    ).toHaveText('Connection revoked');
  });
});
