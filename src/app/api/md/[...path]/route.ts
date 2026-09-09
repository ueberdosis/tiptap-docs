import { NextRequest, NextResponse } from 'next/server'
import { resolveContentPath, normalizeRoutePath } from '@/server/markdown/resolveContentPath'
import { fileToMarkdown } from '@/server/markdown/fileToMarkdown'
import { changelogToMarkdown } from '@/server/markdown/changelogToMarkdown'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'

// Needs the Node runtime for filesystem access to src/content.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ path?: string[] }> }

const CHANGELOG_PREFIX = 'resources/changelog/'

/** Append `.md` to internal doc routes (but not to asset paths with an extension). */
function toMarkdownDestination(destination: string): string {
  if (/\.[a-z0-9]+$/i.test(destination)) return destination
  return `${destination}.md`
}

/**
 * Build a 200 markdown response with the shared canonical/cache/robots headers.
 *
 * When reached via `Accept: text/markdown` (proxy signal), this response is
 * cached under the bare HTML URL's key. Next strips `Vary: Accept` from the HTML
 * page response (a known framework bug), so a Vary-ignoring shared cache could
 * otherwise hand this markdown to a browser. Keep it out of shared caches; the
 * standalone `.md` URL is its own key and stays cacheable.
 */
function markdownResponse(markdown: string, canonical: string, negotiated: boolean): NextResponse {
  const cacheControl = negotiated
    ? 'private, no-store'
    : 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      // Same URL serves HTML or Markdown depending on the Accept header.
      Vary: 'Accept',
      'Cache-Control': cacheControl,
      // Point crawlers at the canonical human page …
      Link: `<${canonical}>; rel="canonical"`,
      // … and keep the markdown duplicate out of search indexes.
      'X-Robots-Tag': 'noindex',
    },
  })
}

export async function GET(request: NextRequest, { params }: Params) {
  const { path: segments } = await params
  const routePath = normalizeRoutePath((segments ?? []).join('/'))
  const negotiated = request.headers.get('x-markdown-negotiated') === '1'

  // Changelog pages are generated from JSON data and rendered by the
  // `resources/changelog/[slug]` route, so they have no `.mdx` file for
  // resolveContentPath to find. Serve their markdown directly. A miss falls
  // through to resolveContentPath, which yields the shared 404 response.
  if (routePath.startsWith(CHANGELOG_PREFIX)) {
    const slug = routePath.slice(CHANGELOG_PREFIX.length)
    if (!slug.includes('/')) {
      const canonical = createCanonicalUrl(['resources', 'changelog', slug])
      const markdown = changelogToMarkdown(slug, canonical)
      if (markdown) {
        return markdownResponse(markdown, canonical, negotiated)
      }
    }
  }

  const resolved = resolveContentPath(routePath)

  if (resolved.type === 'redirect') {
    const target = new URL(toMarkdownDestination(resolved.destination), request.nextUrl.origin)
    return NextResponse.redirect(target, resolved.permanent ? 308 : 307)
  }

  if (resolved.type === 'not-found') {
    return new NextResponse(`# Not found`, {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        // Body reflects the request path; stop browsers MIME-sniffing it to HTML.
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  try {
    // Canonical points at the human HTML page on the stable production domain
    // (matches the page's own <link rel="canonical">), not the request origin
    // which would be the deployment URL.
    const canonical = createCanonicalUrl(resolved.routePath ? resolved.routePath.split('/') : [])
    const markdown = await fileToMarkdown(resolved.filePath, canonical)

    return markdownResponse(markdown, canonical, negotiated)
  } catch (error) {
    console.error(`Failed to render markdown for /${routePath}:`, error)
    return new NextResponse('# Error\n\nFailed to render this page as markdown.\n', {
      status: 500,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }
}
