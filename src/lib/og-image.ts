import { generateOGImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { pageMetaDescription } from './page-meta';
import { appName, getPageImageUrl, ogImageSize } from './shared';
import type { DocsSource } from './source';

/** Route handler and static params of the Open Graph images for one docs version. */
export function createImageRoute(source: DocsSource) {
  return {
    async GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
      const { slug } = await params;
      const page = source.getPage(slug.slice(0, -1));
      if (!page) notFound();

      return generateOGImage({
        title: page.data.title,
        description: pageMetaDescription(page.data),
        site: appName,
        ...ogImageSize,
      });
    },
    generateStaticParams() {
      return source.getPages().map((page) => ({
        lang: page.locale,
        slug: getPageImageUrl(page).segments,
      }));
    },
  };
}
