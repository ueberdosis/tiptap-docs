'use client';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { getVersionName } from '@/lib/versions';

/** The Fumadocs root provider. Search only finds pages of the version the URL belongs to. */
export function Provider({ children }: { children: ReactNode }) {
  const version = getVersionName(usePathname());
  return (
    <RootProvider search={{ options: { api: '/docs/api/search', defaultTag: version } }}>
      {children}
    </RootProvider>
  );
}
