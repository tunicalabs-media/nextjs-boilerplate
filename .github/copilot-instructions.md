# Copilot Instructions for This Repository

Follow these rules by default for all code generation and edits:

1. Read `AGENTS.md` first and treat it as required project guidance.
2. Use local standards from `.agents/skills/`:
   - `next-best-practices`
   - `frontend-implementation`
   - `component-quality-check`
   - `api-and-data-patterns`
3. For data-fetching, metadata, ISR, and API-related changes, read and follow `.agents/skills/fetch-pattern/SKILL.md`.
4. Default to Next.js 16 App Router server-first patterns:
   - Server Components by default
   - `'use client'` only when necessary
   - Route handlers in `src/app/**/route.ts`
5. Keep TypeScript strict and avoid `any` unless necessary.
6. Reuse existing UI primitives in `src/components/ui` and design tokens from `src/app/globals.css`.
7. Keep changes small and task-scoped; do not introduce unrelated refactors.
8. Do not leave placeholder production metadata/config values (for example `example.com`), and avoid brittle build-time external demo fetches without fallback behavior.
9. After substantial edits, ensure the project passes:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
