import { Page, Request, Route } from '@playwright/test';
import { ApiScenario, ApiState } from './apiState';
import { isRealApi } from './env';
import { matchRoute, MockResponse, notMocked } from './handlers';

/** Every backend call goes through `/v1/`; Clerk's frontend API does too, so hosts are checked. */
export const API_URL_PATTERN = '**/v1/**';
const CLERK_HOST_PATTERN = /(^|\.)clerk\.(accounts\.dev|com)$|^clerk\./;

const isClerkRequest = (url: URL): boolean =>
  CLERK_HOST_PATTERN.test(url.hostname);

const corsHeaders = (request: Request): Record<string, string> => ({
  'access-control-allow-origin': request.headers().origin ?? '*',
  'access-control-allow-credentials': 'true',
  'access-control-allow-headers': 'authorization, content-type',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
});

const parseJsonBody = (request: Request): unknown => {
  const raw = request.postData();
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const fulfill = (route: Route, request: Request, response: MockResponse) =>
  route.fulfill({
    status: response.status,
    headers: corsHeaders(request),
    ...(response.body === undefined ? {} : { json: response.body }),
  });

const handleApiRoute = (route: Route, state: ApiState): Promise<void> => {
  const request = route.request();
  const url = new URL(request.url());
  if (isClerkRequest(url)) {
    return route.fallback();
  }
  if (request.method() === 'OPTIONS') {
    return route.fulfill({ status: 204, headers: corsHeaders(request) });
  }

  const path = `${url.pathname}${url.search}`;
  state.recordCall(request.method(), path);
  const match = matchRoute(request.method(), url.pathname);
  if (!match) {
    console.warn(`[e2e] unmocked API request: ${request.method()} ${path}`);
    return fulfill(route, request, notMocked());
  }
  const response = match.handle(
    state,
    { url, body: parseJsonBody(request) },
    match.params,
  );
  return fulfill(route, request, response);
};

/**
 * Serves the backend from an in-memory `ApiState` for this page.
 * With `E2E_API=real` no route is installed and requests reach the configured backend.
 */
export const mockApi = async (
  page: Page,
  scenario: ApiScenario,
): Promise<ApiState> => {
  const state = new ApiState(scenario);
  if (isRealApi()) {
    return state;
  }
  await page.route(API_URL_PATTERN, (route) => handleApiRoute(route, state));
  return state;
};
