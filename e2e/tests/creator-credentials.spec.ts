import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { ApiState, OUTSIDE_REVOCATION_REASON } from '../fixtures/apiState';
import {
  ALICE_MEMBERSHIP_ID,
  ALICE_REVOKED_REASON,
  VERIFIABLE_CREATOR_TYPE,
} from '../fixtures/data/credentials';
import {
  CREATOR_ALICE,
  ISSUER_NAME,
  PLATFORM_HOST,
} from '../fixtures/data/users';
import { mockApi } from '../fixtures/mockApi';
import { requireAuth, requireMockedApi } from '../fixtures/skips';
import { TestId } from '../fixtures/testIds';
import { CreatorCredentialsPage } from '../pages/creatorCredentialsPage';

requireAuth('creator');
requireMockedApi();

test.describe('creator: credentials', () => {
  let api: ApiState;
  let credentialsPage: CreatorCredentialsPage;

  test.beforeEach(async ({ page }) => {
    api = await mockApi(page, { role: 'creator' });
    credentialsPage = new CreatorCredentialsPage(page);
    await credentialsPage.goto();
  });

  test('C1 lists issued credentials and the Verified Creator card with verifiedBy', async () => {
    const issued = credentialsPage.activePanel();

    await expect(issued.getByText(CREATOR_ALICE.email ?? '')).toBeVisible();
    await expect(issued.getByText(ISSUER_NAME)).toBeVisible();

    const verifiedCreator = credentialsPage.verifiedCreatorCard();
    await expect(verifiedCreator).toBeVisible();
    await expect(verifiedCreator).toContainText('Verified Creator');
    await expect(verifiedCreator).toContainText(PLATFORM_HOST);
    await expect(issued.getByText(ALICE_REVOKED_REASON)).toHaveCount(0);
  });

  test('C2 the revoked tab shows issuer, date and reason', async () => {
    await credentialsPage.openRevokedTab();

    await expect(credentialsPage.revokedCards()).toHaveCount(1);
    const details = credentialsPage
      .revokedCards()
      .getByTestId(TestId.creatorRevokedDetails);
    await expect(details).toContainText('Revoked by');
    await expect(details).toContainText(ISSUER_NAME);
    await expect(details).toContainText('Revoked on');
    await expect(details).toContainText('20 Oct 2026');
    await expect(details).toContainText(ALICE_REVOKED_REASON);
    await expect(
      credentialsPage.revokedCards().getByTestId(TestId.credentialDownload),
    ).toBeEnabled();
  });

  test('C3 after the issuer revokes, refocusing the tab refreshes the list', async () => {
    await expect(
      credentialsPage.activePanel().getByText(ISSUER_NAME),
    ).toHaveCount(1);

    api.revokeFromOutside(ALICE_MEMBERSHIP_ID);
    await credentialsPage.refocusWindow();

    await expect(
      credentialsPage.activePanel().getByText(ISSUER_NAME),
    ).toHaveCount(0);
    await credentialsPage.openRevokedTab();
    await expect(credentialsPage.revokedCards()).toHaveCount(2);
    await expect(credentialsPage.revokedSection()).toContainText(
      OUTSIDE_REVOCATION_REASON,
    );
  });

  test('N1 the Verified Creator card downloads a JSON whose type contains VerifiableCreator', async ({
    page,
  }) => {
    const downloadPromise = page.waitForEvent('download');
    await credentialsPage
      .verifiedCreatorCard()
      .getByTestId(TestId.credentialDownload)
      .click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.json$/);
    const content = JSON.parse(await readFile(await download.path(), 'utf8'));
    expect(content.type).toContain(VERIFIABLE_CREATOR_TYPE);
    expect(content.credentialSubject).toMatchObject({
      id: CREATOR_ALICE.didKey,
      verifiedBy: PLATFORM_HOST,
    });
  });
});
