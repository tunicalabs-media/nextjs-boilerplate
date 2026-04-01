<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Purpose

This file is the operating manual for coding agents working in this repository.
Follow these instructions before making changes, while implementing, and before finalizing work.

## Core priorities

1. Preserve correctness and safety over speed.
2. Follow current Next.js 16 App Router conventions.
3. Prefer minimal, focused changes over broad refactors.
4. Keep behavior explicit and type-safe.
5. Leave the repo in a cleaner state than you found it.

## First steps for every task

1. Read the nearest `AGENTS.md` and any referenced project rules.
2. Inspect relevant files before editing (`package.json`, route files, configs).
3. Confirm whether code is Server Component or Client Component before adding hooks or browser APIs.
4. If behavior is unclear, consult authoritative docs first (see references below).
5. Read and apply local agent skills under `.agents/skills/` relevant to the task.
6. For any data-fetching, metadata, ISR, or API-layer work, read and follow `.agents/skills/fetch-pattern/SKILL.md` before editing.

## Local standards sources

Use these files as project-local source of truth in addition to framework docs:

- `.agents/skills/next-best-practices/SKILL.md`
- `.agents/skills/frontend-implementation/SKILL.md`
- `.agents/skills/component-quality-check/SKILL.md`
- `.agents/skills/api-and-data-patterns/SKILL.md`
- `.agents/skills/fetch-pattern/SKILL.md`

If instructions conflict, prefer this order:
1. Explicit user request
2. `AGENTS.md`
3. `.agents/skills/fetch-pattern/SKILL.md`
4. `.agents/skills/*`
5. External generic defaults

## Next.js 16 App Router rules

- Default to **Server Components**; add `'use client'` only for:
  - state/effects
  - browser APIs
  - client-side event handlers
- Keep route UI conventions in `src/app`:
  - `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx`
- Keep API endpoints in `route.ts` files under `src/app/**`.
- Treat request APIs as async when needed (`params`, `searchParams`, `cookies()`, `headers()`, etc.).
- Avoid legacy or deprecated patterns (`next lint`, Pages Router-only APIs in App Router code, outdated middleware naming guidance).

## TypeScript and architecture standards

- Keep `strict` TypeScript compatibility; avoid `any` unless absolutely necessary.
- Use `type` imports when possible.
- Reuse shared types from `src/types`.
- Use the `@/*` alias for internal imports when it improves clarity.
- Place code by concern:
  - `src/app` -> routing + route-level UI
  - `src/components/ui` -> reusable presentational primitives
  - `src/components/shared` -> shared app sections
  - `src/services` -> API/service functions
  - `src/lib` -> utility and infra helpers

## Styling and UI rules

- Use Tailwind utility classes and existing design tokens from `globals.css`.
- Prefer existing components in `src/components/ui` before creating new abstractions.
- Keep accessibility in mind (semantic tags, labels, focus states, keyboard interaction).
- Use `next/font` and `next/image` best practices where applicable.

## Error handling and data patterns

- Use route-level error boundaries (`error.tsx`) and root fallback (`global-error.tsx`) appropriately.
- Fetch server data in Server Components whenever possible.
- Use Route Handlers for endpoint behavior (`src/app/**/route.ts`).
- Keep client fetching for truly interactive/client-only use cases.

## Critical implementation guardrails

- Never leave placeholder production values in app metadata/config (for example `example.com`); use environment-driven values.
- Avoid hard build-time dependence on flaky external APIs for demo content; include safe fallback behavior when needed.
- Keep environment branching centralized (constants/config), not scattered across pages/components.
- Ensure root error UIs remain styled and usable (`global-error.tsx` should not ship broken/unstyled fallback UX).
- When adding or changing rules, keep `AGENTS.md`, `.cursor/rules`, and `.github/copilot-instructions.md` aligned.

## Quality gates (must pass)

Run these checks after substantial changes:

```bash
npm run lint
npm run typecheck
npm run build
```

If formatting is needed:

```bash
npm run format
```

## Commit and PR hygiene

- Keep changes scoped to the task.
- Do not include unrelated edits.
- Update docs when behavior, setup, or conventions change.
- Ensure local checks pass before proposing merge.

## Security and safety

- Never commit secrets (`.env*`, keys, tokens).
- Do not introduce unsafe network calls or logging of sensitive values.
- Validate external data and avoid trusting user input.

## Agent behavior guidelines

- Prefer reading and understanding existing code before introducing new patterns.
- Explain tradeoffs briefly when multiple valid approaches exist.
- If blocked by ambiguity, ask focused questions with clear options.
- When modifying conventions, update this `AGENTS.md` and `README.md` together.

## Authoritative references

Use official docs first, then ecosystem docs:

- [Next.js docs](https://nextjs.org/docs)
- [Next.js App Router project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js v16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [React docs](https://react.dev/)
- [TypeScript handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [shadcn/ui docs](https://ui.shadcn.com/docs)
- [ESLint docs](https://eslint.org/docs/latest/)
- [Prettier docs](https://prettier.io/docs/en/)
- [OpenAI AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md/)
