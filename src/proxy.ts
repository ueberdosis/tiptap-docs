import { NextRequest, NextResponse } from 'next/server'

/**
 * AI crawlers / agents that should receive raw markdown instead of HTML.
 * Sources verified against vendor documentation (April 2026).
 * Match by checking if the request UA *contains* `pattern` (case-insensitive).
 */
type AIUserAgent = {
  pattern: string
  vendor: string
  purpose: string
  deprecated?: boolean
}

const AI_USER_AGENTS: AIUserAgent[] = [
  // OpenAI
  { pattern: 'GPTBot', vendor: 'OpenAI', purpose: 'training' },
  { pattern: 'OAI-SearchBot', vendor: 'OpenAI', purpose: 'search-index' },
  { pattern: 'ChatGPT-User', vendor: 'OpenAI', purpose: 'user-fetch' },

  // Anthropic
  { pattern: 'ClaudeBot', vendor: 'Anthropic', purpose: 'training' },
  { pattern: 'Claude-User', vendor: 'Anthropic', purpose: 'user-fetch' },
  { pattern: 'Claude-SearchBot', vendor: 'Anthropic', purpose: 'search-index' },
  { pattern: 'anthropic-ai', vendor: 'Anthropic', purpose: 'training', deprecated: true },
  { pattern: 'claude-web', vendor: 'Anthropic', purpose: 'user-fetch', deprecated: true },

  // Google (Gemini / NotebookLM / Vertex / agents)
  { pattern: 'Google-Extended', vendor: 'Google', purpose: 'training-opt-out-token' },
  { pattern: 'GoogleOther', vendor: 'Google', purpose: 'misc' },
  { pattern: 'Google-CloudVertexBot', vendor: 'Google', purpose: 'enterprise-retrieval' },
  { pattern: 'Google-NotebookLM', vendor: 'Google', purpose: 'user-fetch' },
  { pattern: 'Google-Read-Aloud', vendor: 'Google', purpose: 'user-fetch' },
  { pattern: 'Google-Agent', vendor: 'Google', purpose: 'user-fetch' },

  // Perplexity
  { pattern: 'PerplexityBot', vendor: 'Perplexity', purpose: 'search-index' },
  { pattern: 'Perplexity-User', vendor: 'Perplexity', purpose: 'user-fetch' },

  // Apple — only the AI-specific opt-out token; plain Applebot is general search and excluded.
  { pattern: 'Applebot-Extended', vendor: 'Apple', purpose: 'training-opt-out-token' },

  // Meta — `facebookexternalhit` is the link-preview fetcher, NOT an AI bot; excluded.
  { pattern: 'meta-externalagent', vendor: 'Meta', purpose: 'training' },
  { pattern: 'FacebookBot', vendor: 'Meta', purpose: 'training' },

  // Amazon
  { pattern: 'Amazonbot', vendor: 'Amazon', purpose: 'training+indexing' },

  // Mistral
  { pattern: 'MistralAI-User', vendor: 'Mistral', purpose: 'user-fetch' },

  // DuckDuckGo
  { pattern: 'DuckAssistBot', vendor: 'DuckDuckGo', purpose: 'search-index' },

  // Common Crawl (upstream of many LLM training sets)
  { pattern: 'CCBot', vendor: 'CommonCrawl', purpose: 'training' },

  // ByteDance — undocumented, often spoofs, but UA token is widely reported.
  { pattern: 'Bytespider', vendor: 'ByteDance', purpose: 'training' },

  // Others worth flagging
  { pattern: 'cohere-ai', vendor: 'Cohere', purpose: 'training' },
  { pattern: 'Diffbot', vendor: 'Diffbot', purpose: 'extraction' },
  { pattern: 'ImagesiftBot', vendor: 'Hive', purpose: 'image-discovery' },
  { pattern: 'FirecrawlAgent', vendor: 'Firecrawl', purpose: 'scraper-as-a-service' },
  { pattern: 'YouBot', vendor: 'You.com', purpose: 'search-index' },
  { pattern: 'Kagibot', vendor: 'Kagi', purpose: 'search-index' },
  { pattern: 'PetalBot', vendor: 'Huawei', purpose: 'search-index' },
  { pattern: 'Timpibot', vendor: 'Timpi', purpose: 'search-index' },
  { pattern: 'AwarioBot', vendor: 'Awario', purpose: 'monitoring' },
  { pattern: 'Omgilibot', vendor: 'Webz.io', purpose: 'training-data' },
]

const AI_USER_AGENT_PATTERNS_LOWER = AI_USER_AGENTS.map((e) => e.pattern.toLowerCase())

function matchAIUserAgent(ua: string): AIUserAgent | null {
  if (!ua) return null
  const lower = ua.toLowerCase()
  for (let i = 0; i < AI_USER_AGENT_PATTERNS_LOWER.length; i++) {
    if (lower.includes(AI_USER_AGENT_PATTERNS_LOWER[i])) return AI_USER_AGENTS[i]
  }
  return null
}

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
    endsWithMd || matchAIUserAgent(userAgent) !== null || MARKDOWN_ACCEPT.test(accept)

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
