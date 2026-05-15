import { NextRequest, NextResponse } from 'next/server'

const AI_BOT_PATTERNS = [
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'Anthropic',
  'ChatGPT-User',
  'PerplexityBot',
  'Bytespider',
  'Google-Extended',
]

const AI_BOT_REGEX = new RegExp(AI_BOT_PATTERNS.join('|'), 'i')

function isMarkdownRequest(request: NextRequest): boolean {
  // 1. Accept header contains text/markdown
  const acceptHeader = request.headers.get('accept') || ''
  if (acceptHeader.includes('text/markdown')) {
    return true
  }

  // 2. URL ends with .md
  if (request.nextUrl.pathname.endsWith('.md')) {
    return true
  }

  // 3. Known AI bot user agent
  const userAgent = request.headers.get('user-agent') || ''
  if (AI_BOT_REGEX.test(userAgent)) {
    return true
  }

  return false
}

export function middleware(request: NextRequest) {
  if (!isMarkdownRequest(request)) {
    return NextResponse.next()
  }

  let contentPath = request.nextUrl.pathname

  // Strip .md suffix if present
  if (contentPath.endsWith('.md')) {
    contentPath = contentPath.slice(0, -3)
  }

  // Strip leading slash
  if (contentPath.startsWith('/')) {
    contentPath = contentPath.slice(1)
  }

  // Rewrite to the markdown API route
  // Use nextUrl.clone() to preserve basePath (e.g. /docs)
  // Pass the content path via header since rewrite query params
  // are not visible to the API route in Next.js
  const url = request.nextUrl.clone()
  url.pathname = '/api/markdown'
  url.search = ''
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-markdown-path', contentPath)

  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api/ (API routes)
     * - /_next/ (Next.js internals)
     * - /assets/ (static assets)
     * - common static file extensions (but NOT .md)
     */
    '/((?!api|_next|assets|.*\\.(?:ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}
