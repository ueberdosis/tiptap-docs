import { NextRequest, NextResponse } from 'next/server'

/** Accept header values that explicitly request markdown. */
const MARKDOWN_ACCEPT = /text\/markdown|application\/markdown|text\/x-markdown/i

/** Non-`.md` file extension → static asset, never markdown. */
const NON_MD_EXTENSION = /\.(?!md$)[a-z0-9]+$/i

/**
 * Internal signal: set on the rewritten request when Markdown is served under a
 * bare doc URL via `Accept` negotiation (rather than its own `.md` URL). The
 * markdown route reads it to mark such responses uncacheable by shared caches —
 * see the route handler for why. Always normalized here so clients can't forge
 * or suppress it.
 */
const NEGOTIATED_HEADER = 'x-markdown-negotiated'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const endsWithMd = pathname.endsWith('.md')

  // Bail for static assets (anything with a non-.md extension).
  if (!endsWithMd && NON_MD_EXTENSION.test(pathname)) {
    return NextResponse.next()
  }

  const accept = request.headers.get('accept') ?? ''

  const wantsMarkdown = endsWithMd || MARKDOWN_ACCEPT.test(accept)

  if (!wantsMarkdown) {
    return NextResponse.next()
  }

  // Normalize to content route segments; map root to the index page.
  const cleanPath = (endsWithMd ? pathname.slice(0, -'.md'.length) : pathname).replace(
    /^\/|\/$/g,
    '',
  )
  const target = cleanPath === '' ? 'index' : cleanPath

  const url = request.nextUrl.clone()
  url.pathname = `/api/md/${target}`

  // Normalize the negotiation signal regardless of what the client sent: a `.md`
  // URL is its own cache key (safe to cache publicly), whereas an Accept-served
  // response shares the bare HTML URL's key and must not be shared-cached.
  const headers = new Headers(request.headers)
  if (endsWithMd) headers.delete(NEGOTIATED_HEADER)
  else headers.set(NEGOTIATED_HEADER, '1')

  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  // Run on everything except Next internals, the markdown API itself, and
  // known non-doc top-level files. Asset extensions are filtered in code.
  matcher: [
    '/((?!_next/|api/|assets/|\\.well-known/|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt).*)',
  ],
}
