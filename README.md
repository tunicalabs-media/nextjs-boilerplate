# Next.js App Router Boilerplate

A production-oriented starter built on **Next.js 16 + App Router** with **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and quality tooling out of the box.

## What's included

- Next.js 16 App Router with server/client component examples
- React 19 + TypeScript strict mode
- Tailwind CSS v4 + `prettier-plugin-tailwindcss`
- shadcn/ui (Radix-based) components
- ESLint 9 flat config + import sorting + Prettier
- Husky + lint-staged pre-commit checks
- CI workflow for lint, typecheck, and build
- Sample API route: `GET /api/health`

## Tech stack

- **Framework:** `next@16.2.1`
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Lucide icons
- **Language:** TypeScript 5
- **Quality:** ESLint, Prettier, Husky, lint-staged

## Prerequisites

- Node.js **20.9+** (recommended: latest Node 20 LTS)
- npm (project currently uses `package-lock.json`)

### Use This As a Template

You can bootstrap a new project using this repository as a Next.js template.

> Note: Run these commands in an empty folder (or use a new folder name instead of `.`).

**npm**

```bash
npx create-next-app@latest . -e https://github.com/tunicalabs-media/nextjs-boilerplate
```

**yarn**

```bash
yarn create next-app . -e https://github.com/tunicalabs-media/nextjs-boilerplate
```

**pnpm**

```bash
pnpm create next-app . -e https://github.com/tunicalabs-media/nextjs-boilerplate
```

**bun**

```bash
bunx create-next-app@latest . -e https://github.com/tunicalabs-media/nextjs-boilerplate
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your application.

## Available scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run lint:fix` — run ESLint and apply safe fixes
- `npm run typecheck` — run TypeScript type checks
- `npm run format` — format with Prettier
- `npm run format:check` — verify formatting only

## Project structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/route.ts     # Route Handler example
│   │   ├── dashboard/page.tsx      # Server component example
│   │   ├── examples/page.tsx       # Client component example ('use client')
│   │   ├── error.tsx               # Segment error boundary
│   │   ├── global-error.tsx        # Root-level error UI
│   │   ├── loading.tsx             # Route loading UI
│   │   ├── not-found.tsx           # 404 UI
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── shared/                 # App-level shared UI
│   │   └── ui/                     # shadcn/ui components
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
├── public/                         # Static assets
└── components.json                 # shadcn/ui configuration
```

## Development conventions in this boilerplate

- Use the `@/*` import alias from `tsconfig.json`
- Prefer Server Components by default; add `'use client'` only when needed
- Keep API endpoints in `src/app/**/route.ts`
- Keep shared UI in `src/components`, domain logic in `src/services`/`src/lib`
- Ensure code passes lint, typecheck, and build before merging

## Critical guardrails

- Do not keep placeholder production values (for example `example.com`) in metadata/config.
- Avoid build-time fragility from external demo APIs; use resilient fallbacks for non-critical demo data.
- Keep environment branching in centralized config/constants instead of page-level ad hoc logic.
- Keep `AGENTS.md`, `.cursor/rules`, and `.github/copilot-instructions.md` aligned when standards change.

## Agent skills included

This boilerplate includes project-level skills under `.agents/skills` to help coding agents follow your standards consistently:

- `next-best-practices` - Next.js 16 implementation guidance and pitfalls
- `frontend-implementation` - feature delivery workflow for this repo structure
- `component-quality-check` - UI/component accessibility and consistency checklist
- `api-and-data-patterns` - server/client data boundaries and route-handler patterns
- `fetch-pattern` - required fetch/metadata/ISR conventions for data-layer work

Tip: ask your coding agent to "use the `frontend-implementation` skill" (or another skill by name) before making changes.

## Agent defaults and enforcement

This repo includes default instruction files so major coding agents follow project rules automatically:

- `AGENTS.md` - primary cross-agent rulebook (Codex/Cursor and other AGENTS-aware tools)
- `.cursor/rules/*.mdc` - always-on Cursor rules
- `.github/copilot-instructions.md` - GitHub Copilot repository instructions
- `CLAUDE.md` - delegates to `AGENTS.md`

Important: each tool decides how strongly it follows repository instructions, but this setup gives the best available default coverage.

## API example

- `GET /api/health` returns JSON:
  - `status`
  - `timestamp`
  - `uptime`

## Git hooks and CI

- Pre-commit runs lint + format on staged files via lint-staged
- GitHub Actions workflow (`.github/workflows/quality-gate.yml`) runs:
  1. Lint
  2. Typecheck
  3. Build

## Recommended workflow

1. Create a feature branch
2. Build feature in `src/`
3. Run `npm run lint && npm run typecheck && npm run build`
4. Commit (hooks run automatically)
5. Open PR

## Deployment

Standard Next.js deployment works (Vercel, Docker, self-hosted Node runtime, etc.).

- Build: `npm run build`
- Start: `npm run start`

## Helpful references

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js v16 upgrade notes](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [shadcn/ui docs](https://ui.shadcn.com/docs)
- [ESLint docs](https://eslint.org/docs/latest/)
- [Prettier docs](https://prettier.io/docs/en/)
