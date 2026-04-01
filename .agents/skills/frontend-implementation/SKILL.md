---
name: frontend-implementation
description: Implements frontend features in this Next.js 16 boilerplate with consistent architecture, RSC-first boundaries, and quality checks. Use when building new pages, layouts, shared components, or refactoring frontend code.
---

# Frontend Implementation Workflow

Use this workflow for feature work in this repository.

## 1) Classify the request first

- Route/UI concern -> place in `src/app`.
- Reusable presentational concern -> place in `src/components/ui` or `src/components/shared`.
- Data/service concern -> place in `src/services` or `src/lib`.
- Shared types/constants -> place in `src/types` and `src/constants`.

## 2) Respect RSC boundaries

- Default to Server Components.
- Add `'use client'` only when required by state/effects/browser APIs/event handlers.
- Keep client-only logic out of server files.

## 3) Implement with project conventions

- Use `@/*` imports where clearer than long relative paths.
- Reuse existing UI primitives (`Button`, `Card`, `Badge`) before creating new ones.
- Prefer typed APIs (`type` imports, explicit return types for exported helpers).
- Keep changes focused; avoid broad refactors unless requested.

## 4) Apply quality gate before finalizing

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

If formatting drift appears:

```bash
npm run format
```

## 5) Deliver with a clear handoff

- Explain what changed and why.
- Mention tradeoffs and follow-ups if applicable.
- Call out any skipped verification and how to run it.
