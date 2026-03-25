import { API_BASE_URL } from '@/constants';

/**
 * Generic fetch wrapper with error handling and JSON parsing.
 */
export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Creates a pre-configured fetcher for internal API routes.
 */
export function apiFetcher<T>(path: string, options?: RequestInit): Promise<T> {
  return fetcher<T>(`${API_BASE_URL}${path}`, options);
}
