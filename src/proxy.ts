import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { type NextRequest, NextResponse } from 'next/server';
import { docsContentRoute, docsRoute, docsV2ContentRoute, docsV2Route } from '@/lib/shared';

/** Page URL → Markdown route, per version. v2 comes first, because latest matches its URLs too. */
const versions = [
  [docsV2Route, docsV2ContentRoute],
  [docsRoute, docsContentRoute],
].map(([route, contentRoute]) => ({
  page: rewritePath(`${route}{/*path}`, `${contentRoute}{/*path}/content.md`).rewrite,
  suffix: rewritePath(`${route}{/*path}.md`, `${contentRoute}{/*path}/content.md`).rewrite,
}));

/** Paths that are not pages: Next.js assets and image resizing, and the API routes. */
const nonPagePrefixes = [`${docsRoute}/_next/`, `${docsRoute}/api/`, `${docsV2Route}/api/`];

/** True for a path whose last segment has a file extension, for example `/docs/llms.txt`. */
const isFile = (pathname: string) => /\.[^/]*$/.test(pathname);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (nonPagePrefixes.some((prefix) => pathname.startsWith(prefix))) return NextResponse.next();

  for (const { suffix } of versions) {
    const result = suffix(pathname);
    if (result) return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (!isFile(pathname) && isMarkdownPreferred(request)) {
    for (const { page } of versions) {
      const result = page(pathname);
      if (result) {
        return NextResponse.rewrite(new URL(result, request.nextUrl), {
          headers: {
            // this URL has two representations, selected by `Accept`
            Vary: 'Accept',
            // keeps the Markdown out of shared caches, which may ignore `Vary`
            'Cache-Control': 'private, no-store',
          },
        });
      }
    }
  }

  return NextResponse.next();
}
