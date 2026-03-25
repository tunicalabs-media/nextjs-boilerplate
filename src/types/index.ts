/**
 * Shared TypeScript types used across the application.
 */

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface HealthCheck {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
}
