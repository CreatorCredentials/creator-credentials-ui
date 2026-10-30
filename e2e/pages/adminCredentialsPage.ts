import { expect, Locator, Page } from '@playwright/test';
import { TestId } from '../fixtures/testIds';

export type AdminStatusFilter = 'success' | 'pending' | 'revoked';

/** `/admin/credentials`: filters, the paged table, the details dialog and the revoke dialog. */
export class AdminCredentialsPage {
  readonly rows: Locator;
  readonly detailsModal: Locator;
  readonly revokeModal: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.getByTestId(TestId.adminRow);
    this.detailsModal = page.getByTestId(TestId.adminDetailsModal);
    this.revokeModal = page.getByTestId(TestId.adminRevokeModal);
  }

  async goto(query = ''): Promise<void> {
    await this.page.goto(`/admin/credentials${query}`);
    await expect(this.page.getByTestId(TestId.adminSearch)).toBeVisible();
  }

  table(): Locator {
    return this.page.getByTestId(TestId.adminCredentialsTable);
  }

  rowWithText(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  emptyState(): Locator {
    return this.page.getByTestId(TestId.adminEmpty);
  }

  paginationSummary(): Locator {
    return this.page.getByTestId(TestId.adminPaginationSummary);
  }

  toast(text: string): Locator {
    return this.page.getByRole('alert').filter({ hasText: text });
  }

  async search(query: string): Promise<void> {
    await this.page.getByTestId(TestId.adminSearch).fill(query);
  }

  async showStatus(status: AdminStatusFilter): Promise<void> {
    await this.page.getByTestId(`admin-filter-status-${status}`).click();
  }

  async filterType(type: string): Promise<void> {
    await this.page.getByTestId(TestId.adminFilterType).selectOption(type);
  }

  async filterIssuer(issuerName: string): Promise<void> {
    await this.page
      .getByTestId(TestId.adminFilterIssuer)
      .selectOption({ label: issuerName });
  }

  /** Opens the actions menu of the newest row matching `rowText`. */
  async openMenu(rowText: string): Promise<void> {
    await this.rowWithText(rowText)
      .first()
      .getByTestId(TestId.adminMenu)
      .click();
  }

  async openDetails(rowText: string): Promise<void> {
    await this.openMenu(rowText);
    await this.page.getByTestId(TestId.adminView).click();
    await expect(this.detailsModal).toBeVisible();
  }

  async closeDetails(): Promise<void> {
    await this.detailsModal.getByRole('button', { name: 'Close' }).click();
    await expect(this.detailsModal).toHaveCount(0);
  }

  async openRevokeDialog(rowText: string): Promise<void> {
    await this.openMenu(rowText);
    await this.page.getByTestId(TestId.adminRevoke).click();
    await expect(this.revokeModal).toBeVisible();
  }

  async confirmRevoke(reason?: string): Promise<void> {
    if (reason) {
      await this.page.getByTestId(TestId.adminRevokeReason).fill(reason);
    }
    await this.page.getByTestId(TestId.adminRevokeConfirm).click();
  }
}
