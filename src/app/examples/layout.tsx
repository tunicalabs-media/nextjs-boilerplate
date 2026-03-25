import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Interactive client component examples for state, hooks, and browser-side fetching patterns.',
  alternates: {
    canonical: '/examples',
  },
};

function ExamplesHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-medium">
          Back to Home
        </Link>
        <p className="text-muted-foreground text-sm">Examples Layout</p>
      </div>
    </header>
  );
}

function ExamplesFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground container mx-auto px-4 py-4 text-sm sm:px-6 lg:px-8">
        Custom footer for examples route. Replace with your own section footer.
      </div>
    </footer>
  );
}

export default function ExamplesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ExamplesHeader />
      {children}
      <ExamplesFooter />
    </>
  );
}
