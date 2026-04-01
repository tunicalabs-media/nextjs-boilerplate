---
name: component-quality-check
description: Reviews and improves React/Tailwind components for accessibility, composability, and consistency with shadcn-style patterns. Use when adding or reviewing UI components, layouts, and interaction patterns.
---

# Component Quality Check

Use this checklist whenever you touch UI code.

## Accessibility

- Use semantic elements (`header`, `main`, `nav`, `section`, `button`, etc.).
- Ensure interactive elements are keyboard accessible and focus-visible.
- Avoid click handlers on non-interactive elements.
- Keep text contrast and states readable across themes.

## Composition and API design

- Prefer composition over prop explosion.
- Use existing primitives from `src/components/ui` first.
- Keep component props typed and minimal.
- Ensure `asChild` patterns preserve expected element semantics.

## Styling consistency

- Use Tailwind utility classes aligned with existing tokens in `src/app/globals.css`.
- Keep class lists readable and avoid one-off style drift.
- Reuse `cn()` for conditional class merging.

## Next.js expectations

- Confirm component is server or client intentionally.
- Do not import client hooks into server components.
- Keep route-level UI conventions inside `src/app`.

## Final checks

- Lint/typecheck/build should pass.
- Verify no obvious responsive regressions.
- Verify loading/error/empty states for non-trivial screens.
