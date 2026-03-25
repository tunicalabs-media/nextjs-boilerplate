import Link from 'next/link';

import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Examples', href: '/examples' },
];

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold">
          Boilerplate
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              render={<Link href={item.href} />}
              variant="ghost"
              size="sm"
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
