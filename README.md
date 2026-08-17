# creator-credentials-ui

Next.js (pages router) frontend for the Creator Credentials platform: Clerk-authenticated creator and issuer dashboards for identity verification (email / domain / did:web / X.509 cert) and Verifiable Credential requests against the `creator-credentials-backend` NestJS API.

## Stack

- **Next.js 16, pages router** (`src/pages`); SSR guards via `getServerSideProps` + a `withAuth` wrapper
- **Clerk** (`@clerk/nextjs`) – the **only live auth** (edge middleware + hosted `<SignIn>` / `<SignUp>` / `<UserProfile>`)
- **TanStack Query v4** (`@tanstack/react-query`) – request/mutation hooks over `axios`
- **flowbite** + **flowbite-react** + **tailwindcss** – UI
- **next-i18next** / **i18next** – i18n (**en only**)
- **react-hook-form** + **joi** – forms/validation
- `next-auth` is installed but **legacy/dead** – see Auth model.

## Prerequisites

- Node 22 (see `@types/node` 22)
- **pnpm** (`packageManager: pnpm@10`)
- Docker (the default `dev` / `start:docker` scripts run compose)
- A running `creator-credentials-backend` (default `https://localhost:3200`)
- A Clerk application (publishable + secret keys, same app as the backend)

## Environment variables

> `.env.example` carries several **orphaned** vars (validated by `config` getters but consumed by no runtime code). The docker scripts read `.env.local` (`--env-file .env.local`); `start:prod` reads `FRONTEND_APP_PORT`. Table below is code-verified; correction sources cited `path:line`.

### Live vars

| Var | Public twin | Example | Used for |
|---|---|---|---|
| `NEST_API_URL` | `NEXT_PUBLIC_NEST_API_URL` | `https://localhost:3200` | **Client** backend base for `axiosNest` (all `src/api/requests`) |
| `NEST_API_SSR_URL` | `NEXT_PUBLIC_NEST_API_SSR_URL` | `https://host.docker.internal:3200` | **SSR-only** backend base for `axiosSSRNest` (`getServerSideProps`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | (is public) | `pk_test_...` | Clerk client key |
| `CLERK_SECRET_KEY` | – | `sk_test_...` | Clerk server key (SSR `clerkClient`, edge middleware) |
| `FRONTEND_APP_PORT` | – | `3105` | Dev/prod server port (`start:prod`, docker) |
| `DEBUG_I18N` | – | `disabled` | Toggles i18next debug in `next-i18next.config.js` |
| `DISABLE_I18N_TRANSLATIONS` | – | `true` | When true the app renders raw i18n keys (dev) |

> Note the backend default port. `.env.example` targets `:3200`; the backend's own `main.ts` now defaults to **`3100` (plain HTTP)** (see the backend README). If you run the backend unfronted, set the `NEST_API_URL` / `NEST_API_SSR_URL` pair to match `http://…:3100`.

### Orphaned vars (drop or ignore)

| Var | Public twin | Why orphaned |
|---|---|---|
| `API_MOCKING` | – | Read by `config.API_MOCKING` + surfaced in `next.config.js`, but no MSW/handler code exists in `src`. Dead flag. |
| `API_URL` | `NEXT_PUBLIC_API_URL` | Legacy base (`http://127.0.0.1:4000/api`); validated by `config.API_URL` but no request function uses it. |
| `NEXTAUTH_URL` | `NEXT_PUBLIC_NEXTAUTH_URL` | next-auth base – only a `config` getter + the dead `/auth/signin/email` page reference it. |
| `NEXTAUTH_URL_INTERNAL` | – | next-auth internal base – legacy, unused. |

## Install & run

```bash
pnpm install
```

Docker (the default workflow – scripts pass `--env-file .env.local`):

```bash
pnpm run dev                 # docker-compose.local.yaml, build + detached
pnpm run start:docker        # local compose
pnpm run start:docker:prod   # prod compose (docker-compose.prod.yaml)
```

Run Next directly (no Docker):

```bash
pnpm run start:dev           # next dev --webpack
pnpm run build               # next build --webpack
pnpm run start:prod          # next start -p $FRONTEND_APP_PORT
```

Quality:

```bash
pnpm run lint
pnpm run prettier:check
pnpm run test:unit           # tsc typecheck + vitest
```

## Auth model

**Clerk is the only live auth.** `ClerkProvider` wraps the app (`_app.tsx`) with `signInUrl`/`signUpUrl` pointing at `/welcome`. Edge middleware (`src/middleware.ts`) protects **`/creator*` and `/issuer*` only**; unauthenticated hits redirect to `/welcome`. Protected pages additionally run the `withAuth` SSR guard.

**Role by signup URL.** There is no post-signup "pick a role" screen. The user's role is chosen implicitly by which `/welcome` link they follow (`/auth/signup/creator` vs `/auth/signup/issuer`), then persisted on first hit of a `/creator*` or `/issuer*` page: `withAuth` reads Clerk `publicMetadata.role`, and if unset infers it from the URL and writes it back to Clerk (`withAuth.ts:37-55`). It also promotes the `pendingTosLink` cookie into `publicMetadata.termsAreAccepted` + `termsLink` so the backend webhook can gate user creation on ToS acceptance.

- **next-auth: legacy/dead.** Present only as commented-out plumbing (the `axiosNest` / `axiosSSRNest` Bearer interceptors are no-ops), plus the inert `/auth/signin/email` + `/auth/error` pages. No auth token is attached automatically; hooks thread the Clerk session token through `getHeaders(token)`.

## i18n

`next-i18next`, **`en` only** (`next-i18next.config.js`: `locales: ['en']`, `defaultLocale: 'en'`). Locale JSON under `public/locales/en/`. A few strings are hardcoded English rather than keyed (e.g. the issuer cert page titles). Do not add non-en locales.

## Architecture

Full route map, the two coexisting auth mechanisms (Clerk / next-auth), the axios instances, and the backend request surface are documented in the `specifications` repo:

- Architecture overview – services, ports, data flow
- API reference – the real `/v1` surface (UI ↔ backend cross-checked)
- Verification flows – email / domain / did:web / keypair / cert

Backend it talks to: `creator-credentials-backend` (NestJS, all routes under `/v1`).