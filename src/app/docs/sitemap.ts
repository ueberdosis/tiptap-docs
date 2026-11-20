import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/shared';
import { isPackageChangelog, source } from '@/lib/source';

/**
 * `/docs/sitemap.xml`: every latest page, including the docs home and pages not in the menu.
 * Package changelogs are left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return source
    .getPages()
    .filter((page) => !isPackageChangelog(page))
    .map((page) => page.url)
    .sort()
    .map((url) => ({ url: `${siteUrl}${url}` }));
}
