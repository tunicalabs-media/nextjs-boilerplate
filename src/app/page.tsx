import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: 'App Router',
    description:
      'Built on the latest Next.js App Router with server and client components.',
    badge: 'Core',
  },
  {
    title: 'TypeScript',
    description: 'Strict TypeScript configuration for type-safe development.',
    badge: 'DX',
  },
  {
    title: 'Tailwind CSS v4',
    description:
      'Utility-first CSS with automatic class sorting via Prettier plugin.',
    badge: 'Styling',
  },
  {
    title: 'shadcn/ui',
    description:
      'Beautiful, accessible UI components built on Radix UI primitives.',
    badge: 'UI',
  },
  {
    title: 'ESLint + Prettier',
    description:
      'Pre-configured linting with import sorting and formatting on save.',
    badge: 'Quality',
  },
  {
    title: 'Husky + lint-staged',
    description:
      'Git hooks that automatically lint and format code before every commit.',
    badge: 'CI',
  },
];

/**
 * Home page — this is a **server component** by default.
 * No 'use client' directive needed for static content.
 */
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-4">
          Production-Ready Boilerplate
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Next.js Boilerplate
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          A scalable, best-practices starter with TypeScript, Tailwind CSS v4,
          shadcn/ui, and comprehensive tooling — ready for your next project.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">View Dashboard</Link>
            View Dashboard
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/examples">See Examples</Link>
          </Button>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto mt-20 max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          What&apos;s Included
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <Badge variant="outline">{feature.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
