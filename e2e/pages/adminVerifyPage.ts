import { expect, Locator, Page } from '@playwright/test';
import { TestId } from '../fixtures/testIds';

export type VerifyCheck = 'signature' | 'validity' | 'revocation';

/** `/admin/verify`: the input form and the result card. */
export class AdminVerifyPage {
  readonly result: Locator;

  constructor(private readonly page: Page) {
    this.result = page.getByTestId(TestId.adminVerifyResult);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/verify');
    await expect(this.page.getByTestId(TestId.adminVerifyInput)).toBeVisible();
  }

  async verify(input: string): Promise<void> {
    await this.page.getByTestId(TestId.adminVerifyInput).fill(input);
    await this.page.getByTestId(TestId.adminVerifySubmit).click();
  }

  check(name: VerifyCheck): Locator {
    return this.result.getByTestId(`admin-verify-check-${name}`);
  }

  rawResponse(): Locator {
    return this.page.getByTestId(TestId.adminVerifyRaw);
  }
}
