import { NextRequest, NextResponse } from 'next/server'

/**
 * AI crawlers / agents that should receive raw markdown instead of HTML.
 * Matched case-insensitively against the User-Agent header.
 */
const AI_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Claude-User',
  'CCBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'cohere-ai',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'FacebookBot',
  'DuckAssistBot',
  'YouBot',
  'Diffbot',
]

const AI_USER_AGENTS_PATTERN = new RegExp(AI_USER_AGENTS.join('|'), 'i')

/** Accept header values that explicitly request markdown. */
const MARKDOWN_ACCEPT = /text\/markdown|application\/markdown|text\/x-markdown/i

/** Non-`.md` file extension → static asset, never markdown. */
const NON_MD_EXTENSION = /\.(?!md$)[a-z0-9]+$/i

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const endsWithMd = pathname.endsWith('.md')

  // Bail for static assets (anything with a non-.md extension).
  if (!endsWithMd && NON_MD_EXTENSION.test(pathname)) {
    return NextResponse.next()
  }

  const userAgent = request.headers.get('user-agent') ?? ''
  const accept = request.headers.get('accept') ?? ''

  const wantsMarkdown =
    endsWithMd || AI_USER_AGENTS_PATTERN.test(userAgent) || MARKDOWN_ACCEPT.test(accept)

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
  return NextResponse.rewrite(url)
}

export const config = {
  // Run on everything except Next internals, the markdown API itself, and
  // known non-doc top-level files. Asset extensions are filtered in code.
  matcher: [
    '/((?!_next/|api/|assets/|\\.well-known/|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt).*)',
  ],
}
