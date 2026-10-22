import { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'

export type Breadcrumb = {
  href?: string
  text: string
}

type Item = SidebarLink | SidebarGroup | Omit<SidebarLink, 'type'>

function isAtOrBelow(pathname: string, href: string): boolean {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** The first page an item leads to: its own href, or that of its first linked descendant. */
function firstHref(item: Item): string | undefined {
  if (item.href && !('type' in item && item.type === 'group')) return item.href
  for (const child of item.children ?? []) {
    const href = firstHref(child)
    if (href) return href
  }
  return undefined
}

/** The chain of items from the top of the sidebar down to the one for `pathname`. */
function findTrail(items: Item[], pathname: string, exact: boolean): Item[] | null {
  for (const item of items) {
    const below = findTrail(item.children ?? [], pathname, exact)
    if (below) return [item, ...below]
    const isLink = !('type' in item && item.type === 'group')
    if (isLink && (exact ? item.href === pathname : isAtOrBelow(pathname, item.href))) return [item]
  }
  return null
}

/**
 * Breadcrumbs follow the page's place in the sidebar: the group and the
 * entries above it. A page outside the sidebar takes the deepest entry
 * whose URL it lies below.
 */
export const generateBreadcrumbs = (config: SidebarConfig, pathname: string): Breadcrumb[] => {
  // The global sidebar starts at its groups; a section sidebar starts at its own title
  const root: Breadcrumb[] =
    config.rootHref === '/' ? [] : [{ text: config.title, href: config.rootHref }]

  const exact = findTrail(config.items, pathname, true)
  // The page itself is the title below the breadcrumbs
  const trail = exact ? exact.slice(0, -1) : (findTrail(config.items, pathname, false) ?? [])

  const crumbs = [...root, ...trail.map((item) => ({ text: item.title, href: firstHref(item) }))]
  return crumbs.filter(
    (crumb, i) => i === 0 || crumb.text !== crumbs[i - 1].text || crumb.href !== crumbs[i - 1].href,
  )
}
