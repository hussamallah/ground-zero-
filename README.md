
# Ground Zero Monorepo

A pragmatic monorepo foundation with **pnpm workspaces**, **Next.js 15 App Router**, shared **env** + **UI** packages, **CI**, and tests.

## Stack
- pnpm workspaces monorepo
- apps/web: Next.js 15 (App Router, server components, route handlers)
- packages/config: Zod-validated env loader
- packages/ui: minimal, accessible components (keyboard-first)
- CI: lint, typecheck, test, build on PRs and main
- Tests: Vitest unit/integration; Playwright e2e
- Vercel: ready to link (apps/web/vercel.json)
- Env: `.env.example` -> local, CI, preview, prod

## Getting Started
```bash
pnpm i
pnpm dev
```

## Test
```bash
pnpm test            # vitest unit
pnpm e2e             # playwright e2e
```

## Deploy
- Connect the repo to Vercel.
- Set root directory to `apps/web` (Vercel auto-detects).
- Define env vars in Vercel UI; they are validated by `@repo/config`.
