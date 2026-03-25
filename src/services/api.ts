import { fetcher } from '@/lib/fetcher';
import type { Post } from '@/types';

const JSONPLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetch posts from JSONPlaceholder (demo API).
 * Used in server components for SSR data fetching examples.
 */
export async function fetchPosts(limit = 6): Promise<Post[]> {
  return fetcher<Post[]>(`${JSONPLACEHOLDER_URL}/posts?_limit=${limit}`);
}

/**
 * Fetch a single post by ID.
 */
export async function fetchPost(id: number): Promise<Post> {
  return fetcher<Post>(`${JSONPLACEHOLDER_URL}/posts/${id}`);
}
