'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground mt-4">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} className="mt-8">
        Try Again
      </Button>
    </div>
  );
}
