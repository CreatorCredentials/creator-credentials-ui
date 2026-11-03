import {
  ConsoleMessage,
  expect,
  Page,
  Request,
  Response,
  test as base,
} from '@playwright/test';
import { isBackendApiUrl } from './apiUrls';

export type BackendCall = {
  method: string;
  path: string;
  status: number;
};

/** `console.error` output the dev server and Clerk's development instance produce on every page. */
const KNOWN_CONSOLE_NOISE: RegExp[] = [
  /Clerk has been loaded with development keys/,
  /Download the React DevTools/,
  /\[HMR\]|\[Fast Refresh\]|webpack-hmr/,
];

const isSuccess = (status: number): boolean => status >= 200 && status < 300;

const isKnownNoise = (text: string): boolean =>
  KNOWN_CONSOLE_NOISE.some((pattern) => pattern.test(text));

const describeCall = (request: Request): Omit<BackendCall, 'status'> => {
  const url = new URL(request.url());
  return { method: request.method(), path: `${url.pathname}${url.search}` };
};

/**
 * Observes one page: every backend response, every request that never got one
 * and every unexpected `console.error` or uncaught exception.
 */
export class PageHealth {
  readonly backendCalls: BackendCall[] = [];
  readonly failedRequests: string[] = [];
  readonly consoleErrors: string[] = [];

  constructor(private readonly page: Page) {
    page.on('response', (response) => this.recordResponse(response));
    page.on('requestfailed', (request) => this.recordFailedRequest(request));
    page.on('console', (message) => this.recordConsoleMessage(message));
    page.on('pageerror', (error) => this.consoleErrors.push(error.message));
  }

  failedBackendCalls(): BackendCall[] {
    return this.backendCalls.filter((call) => !isSuccess(call.status));
  }

  /** Waits for the page to settle, then checks every backend call answered 2xx and the console stayed clean. */
  async expectHealthy(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    expect(this.failedBackendCalls(), 'backend calls not answered 2xx').toEqual(
      [],
    );
    expect(this.failedRequests, 'backend calls without a response').toEqual([]);
    expect(this.consoleErrors, 'unexpected console errors').toEqual([]);
  }

  private recordResponse(response: Response): void {
    const request = response.request();
    if (isBackendApiUrl(new URL(request.url()))) {
      this.backendCalls.push({
        ...describeCall(request),
        status: response.status(),
      });
    }
  }

  private recordFailedRequest(request: Request): void {
    if (isBackendApiUrl(new URL(request.url()))) {
      this.failedRequests.push(
        `${request.method()} ${request.url()}: ${request.failure()?.errorText ?? 'no response'}`,
      );
    }
  }

  private recordConsoleMessage(message: ConsoleMessage): void {
    if (message.type() === 'error' && !isKnownNoise(message.text())) {
      this.consoleErrors.push(message.text());
    }
  }
}

/** `test` with a `health` fixture that starts observing the page before the test body runs. */
export const test = base.extend<{ health: PageHealth }>({
  health: async ({ page }, provide) => {
    await provide(new PageHealth(page));
  },
});

export { expect };
