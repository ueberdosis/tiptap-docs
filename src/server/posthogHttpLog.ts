import type { NextRequest } from 'next/server'

/**
 * Server-side `$http_log` capture for PostHog.
 *
 * Bots, crawlers and AI agents mostly don't execute JavaScript, so they never
 * fire a client-side `$pageview`.
 *
 * Disabled unless `POSTHOG_API_KEY` is set (read at runtime, not build time).
 */

const CAPTURE_TIMEOUT_MS = 3000

/** Text files that crawlers and agents fetch and that are worth counting. */
const LOGGED_TEXT_FILES = /^\/(llms\.txt|robots\.txt|sitemap\.xml)$/

/** Extensionless paths, `.md` and `.html` — i.e. documents, not assets. */
const HAS_ASSET_EXTENSION = /\.(?!(?:md|html)$)[a-z0-9]+$/i

/**
 * Headers the Next.js client router (and browsers) send for in-app navigations
 * and prefetches. Those come from JS-running browsers that already report
 * `$pageview`, and prefetches aren't visits at all.
 */
const CLIENT_ROUTER_HEADERS = ['rsc', 'next-router-prefetch', 'next-router-segment-prefetch']

function firstValue(header: string | null) {
  return header?.split(',')[0]?.trim() || null
}

export function shouldLogRequest(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false

  const { pathname } = request.nextUrl
  if (HAS_ASSET_EXTENSION.test(pathname) && !LOGGED_TEXT_FILES.test(pathname)) return false

  const { headers } = request
  if (CLIENT_ROUTER_HEADERS.some((name) => headers.has(name))) return false
  if (/prefetch/i.test(headers.get('sec-purpose') ?? headers.get('purpose') ?? '')) return false

  return true
}

function getClientIp(headers: Headers) {
  return (
    firstValue(headers.get('x-forwarded-for')) ??
    firstValue(headers.get('x-real-ip')) ??
    firstValue(headers.get('cf-connecting-ip'))
  )
}

/**
 * Stable per-client id (hash of IP + host + user agent), as PostHog recommends:
 * a shared id would count all traffic as one visitor, a random one would count
 * every request as a new visitor.
 */
async function createDistinctId(ip: string, host: string, userAgent: string) {
  const data = new TextEncoder().encode(`${ip}|${host}|${userAgent}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
  return `http_log_${hex.slice(0, 32)}`
}

export async function buildHttpLogEvent(request: NextRequest, apiKey: string) {
  const { headers, nextUrl } = request

  // Behind a reverse proxy the request URL carries the internal host, so prefer
  // the forwarded values to reconstruct the URL the client actually requested.
  const host = firstValue(headers.get('x-forwarded-host')) ?? headers.get('host') ?? nextUrl.host
  const protocol = firstValue(headers.get('x-forwarded-proto')) ?? nextUrl.protocol.replace(':', '')
  // `nextUrl.pathname` has the basePath stripped; add it back for the public path.
  const pathname = `${nextUrl.basePath}${nextUrl.pathname}`

  const userAgent = headers.get('user-agent') ?? ''
  const ip = getClientIp(headers)
  const referrer = headers.get('referer')

  return {
    api_key: apiKey,
    event: '$http_log',
    distinct_id: await createDistinctId(ip ?? '', host, userAgent),
    timestamp: new Date().toISOString(),
    properties: {
      $raw_user_agent: userAgent,
      $current_url: `${protocol}://${host}${pathname}${nextUrl.search}`,
      $host: host,
      $pathname: pathname,
      // Anonymous event: no person profile per client. Bot detection only
      // reads event properties, so nothing is lost.
      $process_person_profile: false,
      ...(ip ? { $ip: ip } : {}),
      ...(referrer ? { $referrer: referrer } : {}),
      method: request.method,
      accept: headers.get('accept') ?? '',
    },
  }
}

/**
 * Sends a `$http_log` event for the request. Never throws and never rejects —
 * analytics must not affect serving the page. Pass the returned promise to
 * `event.waitUntil()` so it doesn't delay the response.
 */
export async function captureHttpLog(request: NextRequest, extraProperties?: object) {
  const apiKey = process.env.POSTHOG_API_KEY
  const postHogHost = process.env.POSTHOG_HOST
  if (!apiKey || !postHogHost) return

  try {
    const event = await buildHttpLogEvent(request, apiKey)
    Object.assign(event.properties, extraProperties)

    const host = postHogHost.replace(/\/+$/, '')
    await fetch(`${host}/i/v0/e/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(CAPTURE_TIMEOUT_MS),
    })
  } catch {
    // Swallow: a PostHog outage or timeout must not surface anywhere.
  }
}
