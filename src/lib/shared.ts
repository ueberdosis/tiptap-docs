import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Tiptap Docs';
/** Production origin, for canonical URLs and absolute links. */
export const siteUrl = 'https://tiptap.dev';
/** True only on the production site (`NEXT_PUBLIC_ENVIRONMENT=production`). Read at build time. */
export const isProductionSite = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
/** `X-Robots-Tag` and meta robots value outside production. */
export const previewRobots = 'noindex, nofollow';
/** `X-Robots-Tag` and meta robots value of old versions (`/docs/v<number>`) in production. */
export const legacyRobots = 'noindex';
export const docsRoute = '/docs';
export const docsV2Route = '/docs/v2';
/** Open Graph image routes of the latest pages. */
export const docsImageRoute = `${docsRoute}/og`;
/** Open Graph image routes of the v2 pages. */
export const docsV2ImageRoute = `${docsV2Route}/og`;
/** Size of the Open Graph images, in pixels. */
export const ogImageSize = { width: 1200, height: 630 };
/** Markdown routes of the latest pages. */
export const docsContentRoute = '/llms.mdx/docs';
/** Markdown routes of the v2 pages. */
export const docsV2ContentRoute = '/llms.mdx/docs/v2';

/** GitHub repository and branch of this app, for "Open in GitHub" links. */
export const gitConfig = {
  user: 'ueberdosis',
  repo: 'tiptap-docs',
  branch: 'docs/new',
};

/** Segments of a page's Markdown route, and its public `.md` URL. */
export function getPageMarkdownUrl(page: { slugs: string[]; url: string }) {
  return { segments: [...page.slugs, 'content.md'], url: `${page.url}.md` };
}

/** Segments of a page's Open Graph image route, and its URL under `imageRoute`. */
export function getPageImageUrl(
  page: { slugs: string[]; locale?: string },
  imageRoute = docsImageRoute,
) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: createGetUrl(imageRoute)(segments, page.locale) };
}
