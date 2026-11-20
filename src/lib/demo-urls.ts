'use client';

import { usePathname } from 'next/navigation';
import { getDemoBaseUrl } from '@/lib/demo-base-urls';
import { docsV2Route } from '@/lib/shared';

/** Returns the demo base URL for the docs version of the current page. */
export function useDemoBaseUrl(isPro?: boolean) {
  const pathname = usePathname();
  const isV2 = pathname === docsV2Route || pathname.startsWith(`${docsV2Route}/`);
  return getDemoBaseUrl(isV2 ? 'v2' : 'latest', isPro);
}
