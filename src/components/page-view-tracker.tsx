'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { siteUrl } from '@/lib/shared';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Pushes a `page_view` event to `window.dataLayer` on each client-side route change.
 * Skips the first load. Renders nothing.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  const previousPathname = useRef<string | null>(null);
  const previousURLQuery = useRef<string | null>(null);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousPathname.current = pathname;
      previousURLQuery.current = window.location.search;
      return;
    }

    // Next frame, so `document.title` is the new page's title.
    window.requestAnimationFrame(() => {
      if (
        previousPathname.current !== pathname &&
        (previousPathname.current || document.referrer)
      ) {
        let pageReferrer = document.referrer;

        if (previousPathname.current) {
          pageReferrer = `${siteUrl}${previousPathname.current}`;
        }

        window.dataLayer?.push({
          event: 'page_view',
          page_path: pathname,
          page_title: document.title,
          page_referrer: pageReferrer + previousURLQuery.current,
        });
      }
      previousPathname.current = pathname;
      previousURLQuery.current = window.location.search;
    });
  }, [pathname]);

  return null;
}
