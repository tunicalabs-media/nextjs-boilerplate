---
name: api-and-data-patterns
description: Implements data fetching and API patterns for this Next.js App Router project with stable build behavior, typed responses, and clear server/client separation. Use when creating route handlers, service functions, or data-driven pages.
---

# API and Data Patterns

Apply these rules for data flow changes.

If any rule conflicts with `.agents/skills/fetch-pattern/SKILL.md`, follow `fetch-pattern` as the source of truth.

## Choose the right layer

- Route handlers: `src/app/**/route.ts` for endpoint behavior.
- Services: `src/services` for external API/domain fetch functions.
- Generic helpers: `src/lib` for reusable fetch/util primitives.

## Prefer server-first fetching

- Fetch in Server Components by default.
- Use client-side fetching only for interactive client-only needs.
- Keep browser-only APIs in client components/hooks.

## Make data access resilient

- Avoid hard build-time dependency on flaky external APIs when possible.
- For demo/external APIs, provide graceful fallback behavior (empty or mock-safe output) when acceptable.
- Throw actionable errors with context when requests fail.

## Keep types explicit

- Reuse shared types from `src/types`.
- Avoid `any`; cast only when unavoidable and localize casts.
- Keep exported function return types clear.

## Route handler conventions

- Return typed JSON shapes consistently.
- Avoid leaking sensitive internals in error payloads.
- Keep handlers focused and stateless.

## Verification checklist

- Run lint, typecheck, and build.
- Validate loading/error states for pages consuming the data.
- Confirm behavior in both local dev and production build mode.
