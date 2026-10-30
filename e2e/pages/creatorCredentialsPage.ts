import { expect, Locator, Page } from '@playwright/test';
import { TestId } from '../fixtures/testIds';

/** `/creator/credentials`: the Issued / Pending / Revoked tabs. */
export class CreatorCredentialsPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/creator/credentials');
    await expect(this.page.getByRole('tab', { name: 'Issued' })).toBeVisible();
  }

  /** The panel of the selected tab; hidden panels are excluded by the role query. */
  activePanel(): Locator {
    return this.page.getByRole('tabpanel');
  }

  verifiedCreatorCard(): Locator {
    return this.page.getByTestId(TestId.verifiedCreatorCard);
  }

  revokedSection(): Locator {
    return this.page.getByTestId(TestId.creatorRevokedSection);
  }

  revokedCards(): Locator {
    return this.page.getByTestId(TestId.creatorRevokedCard);
  }

  async openRevokedTab(): Promise<void> {
    await this.page.getByTestId(TestId.creatorTabRevoked).click();
    await expect(this.revokedSection()).toBeVisible();
  }

  /** Re-focusing the tab is what makes the credentials query refetch. */
  async refocusWindow(): Promise<void> {
    await this.page.evaluate(() => window.dispatchEvent(new Event('focus')));
  }
}
