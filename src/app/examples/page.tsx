'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Post } from '@/types';

/**
 * Examples page — demonstrates **client component** patterns.
 *
 * Uses 'use client' because it needs:
 * - useState / useEffect for interactivity
 * - Client-side data fetching
 * - Browser APIs (window, etc.)
 */
export default function ExamplesPage() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/health');
      await res.json();

      // Fetch posts client-side
      const postsRes = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=3'
      );
      const postsData = (await postsRes.json()) as Post[];
      setPosts(postsData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchClientData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Client Component Examples</h1>
        <p className="text-muted-foreground mt-2">
          This page uses{' '}
          <Badge variant="secondary">&apos;use client&apos;</Badge> for
          interactive state, client-side fetching, and browser APIs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Counter example */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Counter</CardTitle>
            <CardDescription>
              Demonstrates useState for client-side interactivity.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCount((c) => c - 1)}
            >
              −
            </Button>
            <span className="text-2xl font-bold tabular-nums">{count}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCount((c) => c + 1)}
            >
              +
            </Button>
          </CardContent>
        </Card>

        {/* Media query hook example */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Hook: useMediaQuery</CardTitle>
            <CardDescription>
              Responds to viewport changes using a custom hook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Current viewport:{' '}
              <Badge variant={isDesktop ? 'default' : 'secondary'}>
                {isDesktop ? 'Desktop (≥768px)' : 'Mobile (<768px)'}
              </Badge>
            </p>
          </CardContent>
        </Card>

        {/* Client-side fetch example */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Client-side Data Fetching</CardTitle>
            <CardDescription>
              Posts fetched via useEffect + fetch on the client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="border-muted border-t-primary h-4 w-4 animate-spin rounded-full border-2" />
                <span className="text-muted-foreground text-sm">
                  Fetching...
                </span>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-lg border p-3">
                    <p className="line-clamp-1 text-sm font-medium">
                      {post.title}
                    </p>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {post.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
