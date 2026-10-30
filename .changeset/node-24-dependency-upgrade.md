---
'creator-credentials-ui': minor
---

Move the app to Node.js 24 and upgrade the dependency stack: React 19, Next.js 16.4, TanStack Query v5 (object-form hooks, `isPending`, `placeholderData`, `HydrationBoundary`), flowbite-react 0.10, Vitest 5 with Vite 8 and jsdom 30, TypeScript 6 (tsconfig without `baseUrl`, ES2017 target), `src/middleware.ts` renamed to `src/proxy.ts` (Next 16 proxy convention), and the latest Clerk, i18next, axios, react-hook-form, Testing Library, ESLint and Prettier tooling.
