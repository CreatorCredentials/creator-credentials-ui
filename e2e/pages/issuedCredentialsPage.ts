import { expect, Locator, Page } from '@playwright/test';
import { TestId } from '../fixtures/testIds';

export type IssuedStatusFilter = 'success' | 'revoked';
export type IssuedView = 'cards' | 'table';

/** `/issuer/credentials/issued`: filters, status chips, cards/table and the revoke dialog. */
export class IssuedCredentialsPage {
  readonly cards: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.getByTestId(TestId.credentialCard);
    this.rows = page.getByTestId(TestId.credentialRow);
  }

  async goto(): Promise<void> {
    await this.page.goto('/issuer/credentials/issued');
    await expect(this.page.getByTestId(TestId.issuedSearch)).toBeVisible();
  }

  cardEmails(): Locator {
    return this.cards.getByTestId(TestId.credentialEmail);
  }

  rowEmails(): Locator {
    return this.rows.getByTestId(TestId.credentialEmail);
  }

  cardWithEmail(email: string): Locator {
    return this.cards.filter({ hasText: email });
  }

  rowWithEmail(email: string): Locator {
    return this.rows.filter({ hasText: email });
  }

  emptyState(): Locator {
    return this.page.getByTestId(TestId.issuedEmpty);
  }

  errorBanner(): Locator {
    return this.page.getByTestId(TestId.issuedErrorBanner);
  }

  toast(text: string): Locator {
    return this.page.getByRole('alert').filter({ hasText: text });
  }

  async search(query: string): Promise<void> {
    await this.page.getByTestId(TestId.issuedSearch).fill(query);
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.page.getByTestId(TestId.issuedSort).click();
    await this.page.getByRole('menuitem', { name: optionLabel }).click();
  }

  async showStatus(status: IssuedStatusFilter): Promise<void> {
    await this.page.getByTestId(`issued-status-${status}`).click();
  }

  async switchView(view: IssuedView): Promise<void> {
    await this.page.getByTestId(`issued-view-${view}`).click();
  }

  async openRevokeDialog(email: string): Promise<void> {
    await this.cardWithEmail(email).getByTestId(TestId.credentialMenu).click();
    await this.page.getByTestId(TestId.credentialRevoke).click();
    await expect(this.page.getByTestId(TestId.revokeModal)).toBeVisible();
  }

  async confirmRevoke(reason?: string): Promise<void> {
    if (reason) {
      await this.page.getByTestId(TestId.revokeReason).fill(reason);
    }
    await this.page.getByTestId(TestId.revokeConfirm).click();
  }
}
