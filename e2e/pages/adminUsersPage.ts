import { expect, Locator, Page } from '@playwright/test';
import { TestId } from '../fixtures/testIds';

/** `/admin/users`: the search box, the role chips and the paged table. */
export class AdminUsersPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/admin/users');
    await expect(this.page.getByTestId(TestId.adminUsersSearch)).toBeVisible();
  }

  table(): Locator {
    return this.page.getByTestId(TestId.adminUsersTable);
  }

  emptyState(): Locator {
    return this.page.getByTestId(TestId.adminUsersEmpty);
  }

  /** Whatever the loaded page shows: the table, or the empty state when the filter matches nobody. */
  listOrEmptyState(): Locator {
    return this.table().or(this.emptyState());
  }
}
