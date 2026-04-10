# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a front-end-only Next.js 16 Subscription Tracker Dashboard (Japanese UI). All data is mock/hardcoded — no backend, database, or external APIs are needed.

### Package Manager

Bun is the package manager (`bun.lock` present). Bun must be installed in the environment (`curl -fsSL https://bun.sh/install | bash`). Ensure `~/.bun/bin` is on `PATH`.

### Available Scripts

Standard commands are defined in `package.json`:

- `bun run dev` — Start dev server (Next.js + Turbopack, port 3000)
- `bun run build` — Production build
- `bun run lint` — ESLint
- `bun run typecheck` — TypeScript type checking (`tsc --noEmit`)
- `bun run format` — Prettier formatting

### Caveats

- Next.js 16 with Turbopack is used for dev. The dev server starts quickly (~3s).
- No `.env` file is needed — the app has zero external dependencies.
- Mock data lives in `lib/subscription-mock-data.ts`. State is in-memory via React `useState`, so changes are lost on page refresh.
- The streaming category in the UI is labeled "動画・配信" (not "ストリーミング").
