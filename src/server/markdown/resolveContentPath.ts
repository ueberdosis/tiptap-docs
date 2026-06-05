import fs from 'fs'
import path from 'path'
import { redirects } from '@/server/redirects.mjs'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

// All redirect sources are static strings, so an exact-match lookup is enough.
const redirectMap = new Map(redirects.map((r) => [r.source, r]))

export type ResolveResult =
  | { type: 'file'; filePath: string; routePath: string }
  | { type: 'redirect'; destination: string; permanent: boolean }
  | { type: 'not-found' }

/**
 * Turn an incoming request path into a clean content route path:
 * strips query/hash, a trailing `.md`/`.mdx`, and surrounding slashes.
 */
export function normalizeRoutePath(input: string): string {
  let p = input.trim()
  p = p.split('?')[0].split('#')[0]
  p = p.replace(/\.mdx?$/i, '')
  p = p.replace(/\/+/g, '/').replace(/^\/|\/$/g, '')
  return p
}

/**
 * Resolve a route path to a content `.mdx` file, a redirect (shared with
 * next.config.mjs), or not-found. Used by the markdown endpoint so that `.md`
 * requests honor the same 301s as the rendered site.
 */
export function resolveContentPath(input: string): ResolveResult {
  const routePath = normalizeRoutePath(input)
  const rel = routePath === '' ? 'index' : routePath

  const direct = path.join(CONTENT_DIR, `${rel}.mdx`)
  const index = path.join(CONTENT_DIR, rel, 'index.mdx')

  // Guard against path traversal escaping the content directory.
  if (!direct.startsWith(CONTENT_DIR + path.sep) || !index.startsWith(CONTENT_DIR + path.sep)) {
    return { type: 'not-found' }
  }

  if (fs.existsSync(direct)) return { type: 'file', filePath: direct, routePath }
  if (fs.existsSync(index)) return { type: 'file', filePath: index, routePath }

  const redirect = redirectMap.get(`/${routePath}`)
  if (redirect) {
    return { type: 'redirect', destination: redirect.destination, permanent: redirect.permanent }
  }

  return { type: 'not-found' }
}
