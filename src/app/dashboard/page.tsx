import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchPosts } from '@/services/api';
import type { Post } from '@/types';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Server-side data fetching example with Next.js App Router.',
};

/**
 * Dashboard page — demonstrates **server-side data fetching**.
 *
 * This is a server component: the `fetch` call runs on the server at
 * request time. No client-side JavaScript is shipped for the data fetch.
 */
export default async function DashboardPage() {
  const posts = await fetchPosts();

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          This page fetches data on the{' '}
          <Badge variant="secondary">server</Badge>. No client JS is needed for
          the data fetch.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: Post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="line-clamp-1 text-base">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3">
                {post.body}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
