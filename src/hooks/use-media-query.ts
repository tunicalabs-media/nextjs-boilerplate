'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook that tracks whether a CSS media query matches.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value via listener pattern to satisfy React Compiler
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}
