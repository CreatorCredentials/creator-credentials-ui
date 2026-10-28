# End-to-end tests (Playwright)

Browser tests for the creator and issuer dashboards. Scenario IDs in the test
titles (`P1`, `I5`, `C3`, ...) refer to the e2e scenario table in the
`specifications` repo (`specs/11-planned-changes.md`, "Test plan").

## Running

```bash
pnpm install
npx playwright install chromium   # once per machine
# macOS 13 has no Chromium build of its own; the macOS 14 build runs fine:
# PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=mac14-arm64 npx playwright install chromium

pnpm test:e2e                     # headless, mocked API (default)
pnpm test:e2e:headed              # watch the browser
pnpm test:e2e:ui                  # Playwright UI mode
npx playwright test --project=public
npx playwright test --list
```

The config starts `pnpm start:dev` on `FRONTEND_APP_PORT` (default 3000) and
reuses a server that is already running on that port. `.env.local` is loaded
for the port and the Clerk keys; the app itself reads it as usual.

## Modes

| Mode | How | What happens |
|---|---|---|
| Mocked API (default) | nothing to set | Every backend call (`**/v1/**`, Clerk hosts excluded) is answered from `e2e/fixtures/` through an in-memory `ApiState` per test, so revoking a credential changes what later requests return. Unmocked calls get a 404 and a console warning. |
| Real API | `E2E_API=real` | No routes are installed; requests reach the backend configured in `NEST_API_URL`. Scenarios that assert fixture content are skipped; `C5 sending a connection request` runs only in this mode because `/creator/issuers/request` is server-rendered from the backend. |

## Authentication

`/issuer/*` and `/creator/*` are protected by Clerk. The `setup` project
(`e2e/auth.setup.ts`) calls `clerkSetup()` and signs in once per role with
`clerk.signIn({ strategy: 'password' })`, saving the browser state to
`e2e/.auth/<role>.json` (git-ignored). The `issuer` and `creator` projects
reuse that state.

Required variables (values are never committed; export them or put them in
your shell profile, not in the repo):

| Variable | Purpose |
|---|---|
| `E2E_ISSUER_EMAIL`, `E2E_ISSUER_PASSWORD` | Clerk test user with `publicMetadata.role = "ISSUER"` |
| `E2E_CREATOR_EMAIL`, `E2E_CREATOR_PASSWORD` | Clerk test user with `publicMetadata.role = "CREATOR"` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk **development** instance keys, read from `.env.local` |
| `FRONTEND_APP_PORT` | Port of the app under test (optional, default 3000) |
| `E2E_API` | `real` to disable mocking (optional) |

When a role's variables are missing, its tests are reported as skipped with
the message `E2E_<ROLE>_EMAIL / E2E_<ROLE>_PASSWORD not set`; the public
scenarios still run.

### Creating the two test users

1. In the Clerk dashboard of the **development** instance, enable the
   password strategy (Email, Phone, Username → Password).
2. Create two users with a verified e-mail address and a password.
3. Set public metadata on each user: `{ "role": "ISSUER" }` and
   `{ "role": "CREATOR" }`. The UI routes by this value (`withAuth`,
   `/welcome`, the sidebar); a missing role is assigned from the first
   protected URL visited, so set it explicitly.
4. In mocked mode the users need nothing in the backend. In real mode the
   issuer must exist in the backend with an imported certificate and the
   creator must be connected to it.

## Layout

```
playwright.config.ts        projects: setup, public, issuer, creator
e2e/auth.setup.ts           Clerk sign-in per role → e2e/.auth/<role>.json
e2e/fixtures/env.ts         env variables, role credentials, paths
e2e/fixtures/mockApi.ts     mockApi(page, { role, failRevoke?, failIssuedList? })
e2e/fixtures/apiState.ts    in-memory backend state and mutations
e2e/fixtures/handlers.ts    route table (method + path → handler)
e2e/fixtures/data/          typed fixtures (import the app's own typings)
e2e/fixtures/testIds.ts     data-testid hooks used by the suite
e2e/pages/                  page objects
e2e/tests/*.spec.ts         one file per area
```

Fixture story: the signed-in issuer is "Acme Publishing"; the signed-in creator
is Alice, who holds one issued and one revoked membership from Acme plus the
platform-issued Verified Creator credential.

## Debugging

```bash
pnpm test:e2e:ui                                  # step through with the UI
npx playwright test --headed --project=issuer     # watch one project
npx playwright test --trace on                    # force traces
npx playwright show-report                        # last HTML report
npx playwright show-trace test-results/<test>/trace.zip
```

Traces are recorded on the first retry (`trace: 'on-first-retry'`); retries
are enabled on CI only. Unmocked API calls are printed as
`[e2e] unmocked API request: GET /v1/...`.

## Type-checking the suite

`e2e/` has its own `tsconfig.json` (not part of the app build or `pnpm lint`):

```bash
npx tsc --noEmit -p e2e/tsconfig.json
npx eslint e2e playwright.config.ts
```
