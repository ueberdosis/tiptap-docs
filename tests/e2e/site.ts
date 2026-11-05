import routes from '../helpers/routes.cjs'

export { routes }

/** The site root including its base path, without a trailing slash. */
export function siteRoot(baseURL: string | undefined): string {
  if (!baseURL) throw new Error('Set baseURL in playwright.config.ts')
  return baseURL.replace(/\/$/, '')
}

/** Turns a route like `/editor` into an absolute URL that keeps the base path. */
export function siteUrl(baseURL: string | undefined, route: string): string {
  return `${siteRoot(baseURL)}${route === '/' ? '' : route}` || '/'
}

/** Strips origin and base path from a Location header, so it compares to a route. */
export function toRoute(baseURL: string | undefined, location: string): string {
  const root = new URL(siteRoot(baseURL))
  const url = new URL(location, root)
  if (url.origin !== root.origin) return url.href
  const basePath = root.pathname.replace(/\/$/, '')
  const pathname =
    basePath && url.pathname.startsWith(basePath)
      ? url.pathname.slice(basePath.length)
      : url.pathname
  return `${pathname || '/'}${url.hash}`
}

/** Groups routes by their first segment, so each section runs as its own test. */
export function bySection(list: string[]): Map<string, string[]> {
  const sections = new Map<string, string[]>()
  for (const route of list) {
    const section = route.split('/')[1] || 'home'
    sections.set(section, [...(sections.get(section) ?? []), route])
  }
  return sections
}

/** Runs `task` over `items` with at most `limit` in flight. */
// eslint-disable-next-line no-unused-vars
type Task<T> = (item: T) => Promise<void>

export async function eachLimit<T>(items: T[], limit: number, task: Task<T>) {
  const queue = [...items]
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    for (let item = queue.shift(); item !== undefined; item = queue.shift()) await task(item)
  })
  await Promise.all(workers)
}
