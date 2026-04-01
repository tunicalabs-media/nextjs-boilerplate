---
name: fetch-pattern
description: Enforces the repository's canonical data-fetching and metadata composition pattern for Next.js App Router projects. Use for any fetch, ISR, metadata, and API-layer work.
---

# Fetch Pattern

This skill is mandatory for data work in this repository.

## Required reference

- Read and follow `./fetch_pattern.md` before implementing any data-layer change.

## Scope

Apply this skill whenever work includes:

- server-side data fetching
- metadata generation (`generateMetadata`, SEO mapping)
- ISR/revalidation strategy
- shared layout data composition
- API URL constant/factory construction
- route handlers or API integration patterns

## Non-negotiable rules

- Prefer server-first data fetching and keep client fetching for interactivity only.
- Use `cache()` wrappers where the pattern requires deduped calls.
- Compose layout data once and spread into page data return shapes.
- Use typed fetch wrappers and consistent return keys.
- Follow metadata helper rules and staging `noindex` behavior.
