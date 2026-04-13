# \_lib Data Fetching Pattern — Reusable Prompt

## Overview

This project uses a **server-side data fetching layer** built in `src/app/_lib/` that follows these principles:

- All fetches happen **server-side** (Next.js App Router RSC).
- `React.cache()` deduplicates identical fetch calls within a single render tree.
- `Promise.all` parallelises independent fetches.
- Layout/shared data (`nav`, `footer`, `sidebar`) is fetched once and composed into every page's data via a shared `getLayoutData()`.
- A typed `getJson<T>` utility wraps `fetch` to keep call sites clean.
- A single `revalidatedFetch` config object is shared across all fetches.
- `metadata.ts` provides `buildMetadata` / `mapSeoToMetadata` helpers that normalise CMS SEO fields into Next.js `Metadata`.

---

## File Structure

```text
src/
  constant.ts            # API_URL, SITE_URL, REVALIDATE_TIME, PROJECT_ENV
  apis/
    layoutApis.ts        # URL constants for nav, footer, sidebar
    pageApis.ts          # URL constants / factories for each page
  app/
    _lib/
      site-data.ts       # All data-fetching functions (cache + Promise.all)
      metadata.ts        # buildMetadata / mapSeoToMetadata helpers
```

---

## 1. `constant.ts` — Environment-Based Config

```ts
type envType = 'production' | 'staging';

export const PROJECT_ENV: envType = process.env
  .NEXT_PUBLIC_PROJECT_ENV as envType;

const API_URL_TEMP = () => {
  if (PROJECT_ENV === 'production') return 'https://assets.oro.in';
  if (PROJECT_ENV === 'staging') return 'http://4.213.141.223:3021';
  return 'https://assets.oro.in'; // fallback
};

const SITE_URL_TEMP = () => {
  if (PROJECT_ENV === 'production') return 'https://www.oro.in';
  if (PROJECT_ENV === 'staging') return 'http://4.213.141.223:3022';
  return 'https://www.oro.in'; // fallback
};

export const API_URL = API_URL_TEMP();
export const SITE_URL = SITE_URL_TEMP();
export const OG_URL = ''; // default OG image URL
export const REVALIDATE_TIME = 60; // ISR revalidation in seconds
```

**Rule:** All environment branching lives here. Pages/APIs never read `process.env` directly.

> `NEXT_PUBLIC_PROJECT_ENV` is baked in at **build time** (not runtime). Pass it via Docker `ARG` — see [§7 Docker Deployment](#7-docker-deployment).

---

## 2. `apis/layoutApis.ts` — Shared Layout URL Constants

```ts
import { API_URL } from '@/constant';

export const FooterApi = `${API_URL}/api/footer?populate[Columns][populate][Links]=true&populate[SocialMediaLinks][populate][Icon][fields]=...`;
export const NavApi = `${API_URL}/api/navbar?populate[Logo][fields]=...&populate[NavLinks]=true`;
export const SideApi = `${API_URL}/api/sidebar?populate[SidebarMenu][populate][SubMenu][populate][JewelleryCollections][populate][JewellerySubCollections][populate][CardMedia][fields]=...`;

// Form submission endpoints (POST targets, not GET data sources)
export const ContactFormApi = `${API_URL}/api/contact-from-submits`;
export const DistributorFormApi = `${API_URL}/api/become-a-distributors`;
```

---

## 3. `apis/pageApis.ts` — Page URL Constants & Factories

```ts
import { API_URL } from '@/constant';

// Static pages: plain string constants
export const HomePageApi = `${API_URL}/api/home?populate[Banner][populate][Media][fields]=...`;
export const CollectionLandingApi = `${API_URL}/api/collection-landing?populate[SEODetails]...`;
export const AboutUsApi = `${API_URL}/api/about-us?populate[SEODetails]...`;
export const CsrApi = `${API_URL}/api/csr?populate[SEODetails]...`;
export const ContactPageApi = `${API_URL}/api/contact-us?populate[SEODetails]...`;
export const DistributorPageApi = `${API_URL}/api/become-a-distributor-page?populate[seoDetails]...`;

// Dynamic pages: factory functions that accept a slug
export const SingleCollectionApi = (slug: string) =>
  `${API_URL}/api/jewellery-collections?filters[Slug][$eq]=${slug}&populate[Banner]...`;

export const SingleCollectionInstaApi = (slug: string) =>
  `${API_URL}/api/instagram-posts?filters[JewelleryCollections][Slug][$eq]=${slug}&populate[Image][fields]=...`;

export const SubCollectionApi = (slug: string) =>
  `${API_URL}/api/jewellery-sub-collections?filters[Slug][$eq]=${slug}&populate[Banner]...`;

export const FounderSingleApi = (slug: string) =>
  `${API_URL}/api/founders?filters[Slug][$eq]=${slug}&populate[SEODetails]...`;

export const StaticPageApi = (slug: string) =>
  `${API_URL}/api/static-pages?filters[Slug][$eq]=${slug}&populate[SEODetails]...`;
```

**Rule:**

- Static page → plain `const` string.
- Dynamic/slug page → arrow function returning the URL string.
- Always populate only the fields you need (`fields[0]=name`, `fields[1]=url`, etc.) to keep response payloads small.
- All endpoints are prefixed with `/api/` (Strapi v4).

---

## 4. `_lib/site-data.ts` — Fetching Layer

### 4a. Core helpers

```ts
import { cache } from 'react';
import { REVALIDATE_TIME } from '@/constant';

type FetchOptions = RequestInit & {
  next?: { revalidate?: number };
};

// Generic typed fetch wrapper
async function getJson<T>(url: string, options?: FetchOptions): Promise<T> {
  const response = await fetch(url, options);
  return response.json();
}

// Shared ISR config — pass to every getJson call
const revalidatedFetch: FetchOptions = {
  next: { revalidate: REVALIDATE_TIME },
};
```

### 4b. Shared layout fetch (deduplicated with `cache`)

```ts
export const getLayoutData = cache(async () => {
  const [footerJson, navJson, sidebarJson] = await Promise.all([
    getJson<{ data: unknown }>(FooterApi, revalidatedFetch),
    getJson<{ data: unknown }>(NavApi, revalidatedFetch),
    getJson<{ data: unknown }>(SideApi, revalidatedFetch),
  ]);

  return {
    footerData: footerJson.data ?? null,
    navbarData: navJson.data ?? null,
    sidebarData: sidebarJson.data ?? null,
  };
});
```

### 4c. Page-level fetch (always calls `getLayoutData` in parallel)

```ts
export const getHomeData = cache(async () => {
  const [layoutData, homeJson] = await Promise.all([
    getLayoutData(), // reused — no extra network call
    getJson<{ data: unknown }>(HomePageApi, revalidatedFetch),
  ]);

  return {
    ...layoutData, // spreads footerData, navbarData, sidebarData
    homeData: homeJson.data ?? null,
  };
});
```

### 4d. Dynamic-slug page fetch

```ts
export const getSingleCollectionData = cache(async (slug: string) => {
  const [layoutData, collectionJson] = await Promise.all([
    getLayoutData(),
    getJson<{ data: unknown[] }>(SingleCollectionApi(slug), revalidatedFetch),
  ]);

  return {
    ...layoutData,
    collectionData: collectionJson.data?.[0] ?? null, // first match
    collectionItems: collectionJson.data ?? [], // full array
  };
});
```

### 4e. Multiple endpoint page fetch

```ts
export const getSubCollectionData = cache(
  async (subcollection: string, collection: string) => {
    const [layoutData, collectionJson, collectionInsta] = await Promise.all([
      getLayoutData(),
      getJson<{ data: unknown[] }>(
        SubCollectionApi(subcollection),
        revalidatedFetch
      ),
      getJson<{ data: unknown[] }>(
        SingleCollectionInstaApi(collection),
        revalidatedFetch
      ),
    ]);

    return {
      ...layoutData,
      collectionData: collectionJson.data?.[0] ?? null,
      collectionItems: collectionJson.data ?? [],
      instaItems: collectionInsta.data ?? [],
    };
  }
);
```

### 4f. Layout-only page

```ts
// Page that needs nav/footer/sidebar but no page-specific API
export const getYourFavouritesData = cache(async () => {
  return getLayoutData();
});
```

### 4g. Complete list of fetch functions

| Function                                          | Return keys (beyond layout)                       | API                                            |
| ------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| `getHomeData()`                                   | `homeData`                                        | `HomePageApi`                                  |
| `getContactData()`                                | `contactData`                                     | `ContactPageApi`                               |
| `getDistributorData()`                            | `distributorData`                                 | `DistributorPageApi`                           |
| `getAboutUsData()`                                | `aboutUsData`                                     | `AboutUsApi`                                   |
| `getCsrData()`                                    | `pageData`                                        | `CsrApi`                                       |
| `getYourFavouritesData()`                         | _(layout only)_                                   | —                                              |
| `getCollectionsLandingData()`                     | `landingData`                                     | `CollectionLandingApi`                         |
| `getFounderData(slug)`                            | `pageData`, `pageItems`                           | `FounderSingleApi(slug)`                       |
| `getSingleCollectionData(slug)`                   | `collectionData`, `collectionItems`               | `SingleCollectionApi(slug)`                    |
| `getSubCollectionData(subcollection, collection)` | `collectionData`, `collectionItems`, `instaItems` | `SubCollectionApi`, `SingleCollectionInstaApi` |
| `getStaticPageData(slug)`                         | `pageData`, `pageItems`                           | `StaticPageApi(slug)`                          |

---

## 5. Consuming in a Page Component

```ts
// app/our-collections/page.tsx
import { getCollectionsLandingData } from "@/app/_lib/site-data";

export default async function OurCollectionsPage() {
  const { navbarData, footerData, sidebarData, landingData } =
    await getCollectionsLandingData();

  return <OurCollectionsContent data={landingData} />;
}
```

For dynamic routes:

```ts
// app/our-collections/[collection]/page.tsx
export default async function CollectionPage({
  params,
}: {
  params: { collection: string };
}) {
  const { navbarData, footerData, collectionData } =
    await getSingleCollectionData(params.collection);
  // ...
}
```

---

## 6. `_lib/metadata.ts` — SEO Metadata Helpers

### 6a. Types

```ts
import type { Metadata } from 'next';

// Input to buildMetadata — all fields optional/nullable
type MetadataInput = {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  metaImage?: string | null; // resolved URL string
  metaImageAlt?: string | null;
  ogType?: Metadata['openGraph'] extends { type?: infer T } ? T : never;
  noindex?: boolean;
  nofollow?: boolean;
};

// Represents a CMS media asset with url + alt text
type SeoAsset = {
  url?: string | null;
  alternativeText?: string | null;
};

// Raw CMS SEO object — supports both camelCase and PascalCase field names
// because different CMS content types may use different conventions
type SeoData = {
  canonicalUrl?: string | null;
  CanonicalUrl?: string | null;
  seoDescription?: string | null;
  SEODescription?: string | null;
  seoTitle?: string | null;
  SEOTitle?: string | null;
  metaImage?: SeoAsset | null;
  MetaImage?: SeoAsset | null;
};

// Input to mapSeoToMetadata
type MapSeoToMetadataInput = {
  pathname: string; // used as canonical URL fallback
  seo?: SeoData | null; // raw object from CMS response
  fallbackTitle?: string | null; // used when CMS seoTitle is empty
  fallbackDescription?: string | null;
  defaultTitle?: string; // absolute last resort — set site-wide
  defaultDescription?: string;
  ogType?: Metadata['openGraph'] extends { type?: infer T } ? T : never;
  nofollow?: boolean;
  noindex?: boolean;
};
```

### 6b. Internal helpers

```ts
// Strips HTML tags (from CMS rich-text fields) and collapses whitespace.
// Returns undefined for non-strings or empty results — safe to use with ||.
function sanitizeMetadataValue(value?: string | null): string | undefined {
  if (typeof value !== 'string') return undefined;
  const sanitizedValue = value
    .replace(/<[^>]*>/g, ' ') // strip tags
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  return sanitizedValue || undefined;
}

// Builds an absolute canonical URL from a path.
// Priority: NEXT_PUBLIC_SITE_URL env var → SITE_URL constant → localhost fallback.
function getCanonicalUrl(path: string): string {
  const baseUrl =
    sanitizeMetadataValue(process.env.NEXT_PUBLIC_SITE_URL) ||
    sanitizeMetadataValue(SITE_URL) ||
    'http://localhost:3000';
  return new URL(path, baseUrl).toString();
}
```

### 6c. `buildMetadata` — low-level builder

Accepts already-resolved strings and returns a fully typed Next.js `Metadata` object.

```ts
import { OG_URL, PROJECT_ENV, SITE_URL } from '@/constant';

export function buildMetadata({
  title,
  description,
  canonicalUrl,
  metaImage,
  metaImageAlt,
  ogType,
  noindex = false,
  nofollow = false,
}: MetadataInput): Metadata {
  // Falls back to the global OG_URL constant if no page-specific image is given
  const imageUrl = metaImage || OG_URL || undefined;

  // On staging, always block indexing regardless of per-page flags
  const isStaging = PROJECT_ENV === 'staging';
  const shouldNoIndex = noindex || isStaging;
  const shouldNoFollow = nofollow || isStaging;

  return {
    title: title || undefined,
    description: description || undefined,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots:
      shouldNoIndex || shouldNoFollow
        ? { index: !shouldNoIndex, follow: !shouldNoFollow }
        : undefined,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      type: ogType || 'website',
      images: imageUrl
        ? [{ url: imageUrl, alt: metaImageAlt || title || undefined }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || undefined,
      description: description || undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
```

**Key behaviours:**

| Behaviour                 | Detail                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------ |
| Staging auto-block        | `PROJECT_ENV === "staging"` forces `noindex + nofollow` regardless of call-site flags         |
| OG image fallback         | Uses global `OG_URL` constant when no page image is provided                                  |
| Undefined coercion        | All fields use `                                                                              |     | undefined`so Next.js omits empty`<meta>` tags entirely |
| Robots omitted when clean | The `robots` field is `undefined` (not set) on production pages that don't opt in to blocking |

### 6d. `mapSeoToMetadata` — CMS field normaliser

Accepts a raw CMS SEO object and handles **dual-casing field names** before delegating to `buildMetadata`. This is the function you call in `generateMetadata()`.

```ts
export function mapSeoToMetadata({
  pathname,
  seo,
  fallbackDescription,
  fallbackTitle,
  defaultDescription = DEFAULT_DESCRIPTION,
  defaultTitle = DEFAULT_TITLE,
  ogType,
  nofollow = false,
  noindex = false,
}: MapSeoToMetadataInput): Metadata {
  // Title: CMS camelCase → CMS PascalCase → page fallback → site default
  const title =
    sanitizeMetadataValue(seo?.seoTitle) ||
    sanitizeMetadataValue(seo?.SEOTitle) ||
    sanitizeMetadataValue(fallbackTitle) ||
    defaultTitle;

  // Description: same priority chain
  const description =
    sanitizeMetadataValue(seo?.seoDescription) ||
    sanitizeMetadataValue(seo?.SEODescription) ||
    sanitizeMetadataValue(fallbackDescription) ||
    defaultDescription;

  // Canonical: CMS value → current pathname (converted to absolute URL)
  const canonicalUrl = getCanonicalUrl(
    sanitizeMetadataValue(seo?.canonicalUrl) ||
      sanitizeMetadataValue(seo?.CanonicalUrl) ||
      pathname
  );

  // Image: camelCase asset → PascalCase asset
  const metaImage =
    sanitizeMetadataValue(seo?.metaImage?.url) ||
    sanitizeMetadataValue(seo?.MetaImage?.url);

  const metaImageAlt =
    sanitizeMetadataValue(seo?.metaImage?.alternativeText) ||
    sanitizeMetadataValue(seo?.MetaImage?.alternativeText);

  return buildMetadata({
    title,
    description,
    canonicalUrl,
    metaImage,
    metaImageAlt,
    ogType,
    noindex,
    nofollow,
  });
}
```

**Priority chain for each field:**

```text
CMS camelCase  →  CMS PascalCase  →  fallback prop  →  defaultTitle / defaultDescription
```

### 6e. Full usage in a page

```ts
// app/our-collections/page.tsx
import type { Metadata } from "next";
import { getCollectionsLandingData } from "@/app/_lib/site-data";
import { mapSeoToMetadata } from "@/app/_lib/metadata";

// generateMetadata and the page component both call getCollectionsLandingData().
// React.cache() ensures only ONE fetch is made.
export async function generateMetadata(): Promise<Metadata> {
  const { landingData } = await getCollectionsLandingData();

  return mapSeoToMetadata({
    pathname: "/our-collections",
    seo: (landingData as any)?.SEODetails,   // raw CMS SEO object
    fallbackTitle: "Our Collections",
    fallbackDescription: "Browse all ORO jewellery collections.",
  });
}

export default async function OurCollectionsPage() {
  const { navbarData, footerData, sidebarData, landingData } =
    await getCollectionsLandingData();   // cache hit — no second fetch

  return <OurCollectionsContent data={landingData} />;
}
```

For dynamic routes with per-page SEO:

```ts
// app/our-collections/[collection]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const { collectionData } = await getSingleCollectionData(params.collection);

  return mapSeoToMetadata({
    pathname: `/our-collections/${params.collection}`,
    seo: (collectionData as any)?.SEODetails,
    fallbackTitle: (collectionData as any)?.Name,
    noindex: !collectionData, // noindex if slug not found
  });
}
```

---

## Pattern Checklist for a New Project

| Step | Action                                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------- |
| 1    | Define `API_URL`, `SITE_URL`, `REVALIDATE_TIME`, `PROJECT_ENV` in `constant.ts`                                             |
| 2    | Create `apis/layoutApis.ts` with URL strings for shared layout endpoints                                                    |
| 3    | Create `apis/pageApis.ts` with URL strings/factories per page                                                               |
| 4    | Create `_lib/site-data.ts` with `getJson`, `revalidatedFetch`, `getLayoutData`, and one `cache(async () => {...})` per page |
| 5    | Create `_lib/metadata.ts` with `buildMetadata` and `mapSeoToMetadata`                                                       |
| 6    | In each `page.tsx`, call the matching `get*Data()` function and destructure the result                                      |
| 7    | In each `generateMetadata()`, call the same `get*Data()` and pass `seo` field + pathname to `mapSeoToMetadata`              |

---

## 7. Docker Deployment

`NEXT_PUBLIC_*` variables are **baked into the client bundle at build time**. Setting them as `ENV` in the Docker runner stage has no effect on client-side code — they must be injected during the `RUN npm run build` step using `ARG`.

### Production build (default)

```sh
docker build -t oro-frontend .
# NEXT_PUBLIC_PROJECT_ENV defaults to "production" via ARG default
```

### Staging build

```sh
docker build --build-arg NEXT_PUBLIC_PROJECT_ENV=staging -t oro-frontend-staging .
```

### Dockerfile pattern

```dockerfile
# ---------- Builder ----------
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .

# ARG makes the value available at build time; ENV exposes it to the npm build script
ARG NEXT_PUBLIC_PROJECT_ENV=production
ENV NEXT_PUBLIC_PROJECT_ENV=$NEXT_PUBLIC_PROJECT_ENV

RUN npm run build

# ---------- Runner ----------
FROM node:24-alpine AS runner
WORKDIR /app

# Runtime ENV for server-side process.env access (API routes / server components)
ENV NEXT_PUBLIC_PROJECT_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

**Why both `ARG` and `ENV`?**

| Scope               | Mechanism                            | Effect                                           |
| ------------------- | ------------------------------------ | ------------------------------------------------ |
| Client JS bundle    | `ARG` → `ENV` before `npm run build` | Value inlined by Next.js webpack at compile time |
| Server-side runtime | `ENV` in runner stage                | Available via `process.env` in API routes / RSC  |

---

## Key Rules

- **Always wrap page fetchers in `cache()`** — this makes `generateMetadata` and the page component share one fetch, not two.
- **Always spread `...layoutData`** into the return object so page components get nav/footer for free.
- **Use `?? null` not `|| null`** — avoids false negatives on `0` or `""` values from the CMS.
- **Return `data?.[0]`** for single-record APIs filtered by slug; keep the full array as `*Items` for fallback/pagination.
- **Staging auto-noindex** — `buildMetadata` reads `PROJECT_ENV` and sets `noindex: true` on staging automatically.
- **Strip HTML in metadata** — `sanitizeMetadataValue` removes HTML tags from CMS rich-text before putting it in meta tags.
