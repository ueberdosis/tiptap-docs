import { NextRequest, NextResponse } from 'next/server'
import { resolveContentPath } from '@/server/markdown/resolveContentPath'
import { fileToMarkdown } from '@/server/markdown/fileToMarkdown'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'

// Needs the Node runtime for filesystem access to src/content.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ path?: string[] }> }

/** Append `.md` to internal doc routes (but not to asset paths with an extension). */
function toMarkdownDestination(destination: string): string {
  if (/\.[a-z0-9]+$/i.test(destination)) return destination
  return `${destination}.md`
}

export async function GET(request: NextRequest, { params }: Params) {
  const { path: segments } = await params
  const routePath = (segments ?? []).join('/')

  const resolved = resolveContentPath(routePath)

  if (resolved.type === 'redirect') {
    const target = new URL(toMarkdownDestination(resolved.destination), request.nextUrl.origin)
    return NextResponse.redirect(target, resolved.permanent ? 308 : 307)
  }

  if (resolved.type === 'not-found') {
    return new NextResponse(`# Not found\n\nNo documentation page exists at \`/${routePath}\`.\n`, {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }

  try {
    const markdown = await fileToMarkdown(resolved.filePath)
    // Canonical points at the human HTML page on the stable production domain
    // (matches the page's own <link rel="canonical">), not the request origin
    // which would be the deployment URL.
    const canonical = createCanonicalUrl(resolved.routePath ? resolved.routePath.split('/') : [])
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        // Same URL serves HTML or Markdown depending on the Accept header.
        Vary: 'Accept',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        // Point crawlers at the canonical human page …
        Link: `<${canonical}>; rel="canonical"`,
        // … and keep the markdown duplicate out of search indexes.
        'X-Robots-Tag': 'noindex',
      },
    })
  } catch (error) {
    console.error(`Failed to render markdown for /${routePath}:`, error)
    return new NextResponse('# Error\n\nFailed to render this page as markdown.\n', {
      status: 500,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }
}
