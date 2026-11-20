'use client';
import { Banner } from 'fumadocs-ui/components/banner';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { docsV2Route } from '@/lib/shared';
import { getV2PageNotice } from '@/lib/v2-notice';

/** The notice bar of the current v2 page. Renders nothing when the page has no notice. */
export function V2NoticeBanner({ sharedPaths }: { sharedPaths: string[] }) {
  const pathname = usePathname().replace(/\/$/, '');
  const shared = useMemo(() => new Set(sharedPaths), [sharedPaths]);
  const path = pathname.startsWith(`${docsV2Route}/`) ? pathname.slice(docsV2Route.length + 1) : '';
  const notice = getV2PageNotice(path, shared);
  if (!notice) return null;

  return (
    <Banner>
      {notice.text && <span className="me-1">{notice.text}</span>}
      <Link href={notice.url} className="underline underline-offset-4">
        {notice.linkText}
      </Link>
    </Banner>
  );
}
