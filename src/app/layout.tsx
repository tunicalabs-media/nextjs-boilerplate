import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';

import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';
import { cn } from '@/lib/utils';

import './globals.css';

const robotoHeading = Roboto({
  subsets: ['latin'],
  variable: '--font-heading',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Next.js Boilerplate',
    template: '%s | Next.js Boilerplate',
  },
  description:
    'A production-ready starter with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.',
  openGraph: {
    type: 'website',
    title: 'Next.js Boilerplate',
    description:
      'A production-ready starter with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.',
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Boilerplate',
    description:
      'A production-ready starter with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
       data-scroll-behavior="smooth"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        robotoHeading.variable
      )}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
