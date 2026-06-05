/**
 * Application-wide constants.
 */

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? 'Next.js Boilerplate';

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

/**
 * Breakpoints (matches Tailwind defaults).
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
