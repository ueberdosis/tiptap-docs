/**
 * A small client for the Typesense API that the search scripts share. It reads
 * the server from the environment and never prints the key.
 *
 *   TYPESENSE_HOST, TYPESENSE_PORT (443), TYPESENSE_PROTOCOL (https)
 *   TYPESENSE_COLLECTION (the scraper's alias, `tiptap_v3`)
 *
 * The NEXT_PUBLIC_DOCSEARCH_* variables of the site work as well.
 */

const env = process.env

export const collection = env.TYPESENSE_COLLECTION || env.NEXT_PUBLIC_DOCSEARCH_INDEX || 'tiptap_v3'

const host = env.TYPESENSE_HOST || env.NEXT_PUBLIC_DOCSEARCH_HOST
const port = env.TYPESENSE_PORT || env.NEXT_PUBLIC_DOCSEARCH_PORT || '443'
const protocol = env.TYPESENSE_PROTOCOL || env.NEXT_PUBLIC_DOCSEARCH_PROTOCOL || 'https'

/** Calls the API with the given key; fails with the status and Typesense's message. */
export async function typesense<T>(
  apiKey: string | undefined,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  if (!host) throw new Error('Set TYPESENSE_HOST (or NEXT_PUBLIC_DOCSEARCH_HOST).')
  if (!apiKey) throw new Error('Set the API key in the environment (see the script).')
  const response = await fetch(`${protocol}://${host}:${port}${path}`, {
    method,
    headers: { 'X-TYPESENSE-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${text}`)
  return (text ? JSON.parse(text) : undefined) as T
}

/** The docs path of an indexed URL, such as `/editor/extensions/nodes/table`. */
export function toPath(url: string): string {
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('#')[0]
  return path.replace(/^\/docs(?=\/|$)/, '').replace(/\/$/, '') || '/'
}
