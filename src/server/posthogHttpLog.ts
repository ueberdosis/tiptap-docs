import type { NextRequest } from 'next/server'

/**
 * Server-side `$http_log` capture for PostHog.
 *
 * Bots, crawlers and AI agents mostly don't execute JavaScript, so they never
 * fire a client-side `$pageview`.
 *
 * Privacy: every document request is logged, people's included, so the client
 * IP address is anonymized before anything leaves this module. It is used in
 * exactly two ways, and never sent in full:
 *
 * 1. `$ip` is sent truncated (see `anonymizeIp`), which is still enough for
 *    PostHog's GeoIP lookup and crawler IP-range checks.
 * 2. `distinct_id` is a keyed hash of the full IP, using a random key that
 *    exists only in this process's memory and is replaced every day (see
 *    `getDailyKey`). It tells clients apart within a day, but can't be traced
 *    back to an IP or linked across days.
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
 * Truncates an IP address so it no longer identifies a single client: IPv4
 * loses its last octet (`203.0.113.42` → `203.0.113.0`), IPv6 keeps only its
 * /48 prefix. Returns null for anything unparseable, so a raw value is never
 * passed on by accident.
 */
export function anonymizeIp(ip: string | null) {
  if (!ip) return null

  // IPv4, optionally with a port or as an IPv4-mapped IPv6 address.
  const v4 = ip.match(/^(?:::ffff:)?(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}(?::\d+)?$/i)
  if (v4)
    return v4.slice(1, 4).every((octet) => Number(octet) <= 255)
      ? `${v4[1]}.${v4[2]}.${v4[3]}.0`
      : null

  // IPv6: expand `::` far enough to read the first three groups.
  const v6 = ip.replace(/^\[|\](?::\d+)?$/g, '').split('%')[0]
  if (!/^[0-9a-f:]+$/i.test(v6) || !v6.includes(':')) return null
  const [head, tail] = v6.split('::')
  const groups = head ? head.split(':') : []
  if (tail === undefined && groups.length !== 8) return null
  if (groups.some((group) => group.length > 4)) return null
  while (groups.length < 3) groups.push('0')

  return `${groups.slice(0, 3).join(':')}::`
}

/**
 * The key for hashing client IPs into distinct ids: random, held only in memory
 * and replaced at the first request of each UTC day.
 *
 * Why not a plain hash of the IP? An unkeyed SHA-256 can be brute-forced. Mixing
 * in a secret key prevents that — as long as the key itself can't leak. So it is:
 *
 * - generated here rather than configured, so it never exists in an env var,
 *   file, log or backup;
 * - non-extractable, so not even this process can read the key material back;
 * - dropped after a day, at which point that day's ids can no longer be tested
 *   against a known IP by anyone, us included. That is what makes the ids
 *   anonymous rather than merely pseudonymous.
 *
 * The accepted trade-offs of keeping the key in memory:
 *
 * - A client's id changes every day, so unique visitors can't be counted across days.
 * - Each process has its own key. A restart (e.g. a deploy) or a second replica
 *   gives the same client a different id, which slightly inflates visitor counts.
 *   Request counts are unaffected.
 *
 * We chose this over a key derived from a configured secret, which would be
 * consistent across restarts and replicas but could be recomputed at any time
 * by whoever holds the secret, and so would never be truly anonymous.
 */
let dailyKey: { day: string; key: Promise<CryptoKey> } | null = null

function getDailyKey() {
  const day = new Date().toISOString().slice(0, 10)
  if (dailyKey?.day !== day) {
    // Stores the promise, so concurrent requests at rollover share one key.
    const key = crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    dailyKey = { day, key }
  }
  return dailyKey.key
}

/**
 * Per-client id: HMAC-SHA-256 of full IP + host + user agent under the daily
 * key. PostHog recommends an id that is stable per client — a shared id would
 * count all traffic as one visitor, a random one would count every request as
 * a new visitor. Using the full IP (rather than the truncated one we send as
 * `$ip`) keeps clients on the same network apart; the keyed hash is what makes
 * that safe.
 */
async function createDistinctId(ip: string, host: string, userAgent: string) {
  const data = new TextEncoder().encode(`${ip}|${host}|${userAgent}`)
  const digest = await crypto.subtle.sign('HMAC', await getDailyKey(), data)
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
  // Privacy: the full IP only ever feeds the keyed hash; `$ip` gets the
  // truncated form. See the module comment.
  const fullIp = getClientIp(headers)
  const ip = anonymizeIp(fullIp)
  const referrer = headers.get('referer')

  return {
    api_key: apiKey,
    event: '$http_log',
    distinct_id: await createDistinctId(fullIp ?? '', host, userAgent),
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
