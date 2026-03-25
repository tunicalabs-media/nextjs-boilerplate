'use client';

import { useEffect } from 'react';

/**
 * Global error boundary — catches errors in the root layout itself.
 * Must include its own <html> and <body> tags because the root layout
 * is replaced when this component renders.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground mt-4">
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 rounded-md px-6 py-2"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
