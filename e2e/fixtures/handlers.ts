import { SendCredentialsRequestPayload } from '@/api/requests/sendCredentialsRequest';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { ApiState } from './apiState';

export type MockRequest = { url: URL; body: unknown };
export type MockResponse = { status: number; body?: unknown };
type RouteParams = Record<string, string>;
type Handler = (
  state: ApiState,
  request: MockRequest,
  params: RouteParams,
) => MockResponse;
type HttpMethod = 'GET' | 'POST';
type RouteDefinition = { method: HttpMethod; pattern: RegExp; handle: Handler };

const ok = (body: unknown): MockResponse => ({ status: 200, body });
const created = (): MockResponse => ({ status: 201 });
const noContent = (): MockResponse => ({ status: 204 });
const notFound = (): MockResponse => ({
  status: 404,
  body: { statusCode: 404, message: 'Not Found' },
});
const conflict = (message: string): MockResponse => ({
  status: 409,
  body: { statusCode: 409, message },
});
const serverError = (): MockResponse => ({
  status: 500,
  body: { statusCode: 500, message: 'Internal server error' },
});

/** Answer for `/v1/**` requests no route covers; the caller logs them. */
export const notMocked = (): MockResponse => ({
  status: 404,
  body: { statusCode: 404, message: 'Not mocked by the e2e suite' },
});

const statusParam = (url: URL): string => url.searchParams.get('status') ?? '';

const listIssuedCredentials: Handler = (state, { url }) => {
  const status = statusParam(url);
  if (
    state.flags.failIssuedList &&
    status !== CredentialVerificationStatus.Pending
  ) {
    return serverError();
  }
  return ok({ credentials: state.issuedCredentials(status) });
};

const revokeCredential: Handler = (state, { body }, { id }) => {
  if (state.flags.failRevoke) {
    return serverError();
  }
  const reason = (body as { reason?: string } | null)?.reason;
  const outcome = state.revoke(id, reason);
  switch (outcome.kind) {
    case 'revoked':
      return ok(outcome.credential);
    case 'pending':
      return conflict('Use reject');
    case 'not-found':
      return notFound();
  }
};

const acceptCredentialRequest: Handler = (state, _request, { id }) => {
  const challenge = state.acceptChallenge(id);
  return challenge ? ok(challenge) : notFound();
};

const sendCredentialRequest: Handler = (state, { body }) => {
  state.recordCredentialRequest(body as SendCredentialsRequestPayload);
  return created();
};

const issuerDetails: Handler = (state, _request, { id }) => {
  const issuer = state.issuerById(id);
  return issuer ? ok({ issuer }) : notFound();
};

const confirmConnectionRequest: Handler = (state, _request, { id }) =>
  state.confirmConnectionRequest(id) ? noContent() : notFound();

export const API_ROUTES: RouteDefinition[] = [
  {
    method: 'GET',
    pattern: /^\/v1\/users$/,
    handle: (state) => ok(state.user()),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/users\/profile$/,
    handle: (state) => ok(state.profile()),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/users\/creators$/,
    handle: (state, { url }) =>
      ok({ creators: state.creators(statusParam(url)) }),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/users\/issuers$/,
    handle: (state) => ok(state.issuers()),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/users\/issuers\/(?<id>[^/]+)$/,
    handle: issuerDetails,
  },
  {
    method: 'POST',
    pattern: /^\/v1\/users\/issuers\/(?<id>[^/]+)\/confirm-request$/,
    handle: confirmConnectionRequest,
  },
  {
    method: 'GET',
    pattern: /^\/v1\/credentials\/issuers$/,
    handle: listIssuedCredentials,
  },
  {
    method: 'GET',
    pattern: /^\/v1\/credentials\/creator$/,
    handle: (state) => ok(state.creatorCredentials()),
  },
  {
    method: 'POST',
    pattern: /^\/v1\/credentials\/request$/,
    handle: sendCredentialRequest,
  },
  {
    method: 'POST',
    pattern: /^\/v1\/credentials\/(?<id>[^/]+)\/revoke$/,
    handle: revokeCredential,
  },
  {
    method: 'POST',
    pattern: /^\/v1\/credentials\/(?<id>[^/]+)\/accept$/,
    handle: acceptCredentialRequest,
  },
  {
    method: 'GET',
    pattern: /^\/v1\/templates\/creator$/,
    handle: (state) => ok({ templates: state.templates() }),
  },
];

export type RouteMatch = { handle: Handler; params: RouteParams };

export const matchRoute = (
  method: string,
  pathname: string,
): RouteMatch | null => {
  for (const route of API_ROUTES) {
    if (route.method !== method) {
      continue;
    }
    const match = route.pattern.exec(pathname);
    if (match) {
      return { handle: route.handle, params: match.groups ?? {} };
    }
  }
  return null;
};
