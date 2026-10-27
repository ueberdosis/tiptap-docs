import { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'
import { isAtOrBelow } from '@/utils/isAtOrBelow'

export type Breadcrumb = {
  href?: string
  text: string
}

type Item = SidebarLink | SidebarGroup | Omit<SidebarLink, 'type'>

const isLink = (item: Item) => !('type' in item && item.type === 'group')

/** The first page an item leads to: its own href, or that of its first linked descendant. */
function firstHref(item: Item): string | undefined {
  if (item.href && isLink(item)) return item.href
  for (const child of item.children ?? []) {
    const href = firstHref(child)
    if (href) return href
  }
  return undefined
}

/** The chain of items from the top of the sidebar down to the one for `pathname`. */
function findTrail(items: Item[], pathname: string): Item[] | null {
  for (const item of items) {
    const below = findTrail(item.children ?? [], pathname)
    if (below) return [item, ...below]
    if (isLink(item) && item.href === pathname) return [item]
  }
  return null
}

/** The chain down to the entry with the longest URL that `pathname` lies below. */
function findDeepestTrail(items: Item[], pathname: string): Item[] | null {
  let best: Item[] | null = null
  const visit = (items: Item[], parents: Item[]) => {
    for (const item of items) {
      const trail = [...parents, item]
      const deeper = !best || item.href.length > best[best.length - 1].href.length
      if (isLink(item) && isAtOrBelow(pathname, item.href) && deeper) best = trail
      visit(item.children ?? [], trail)
    }
  }
  visit(items, [])
  return best
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

  const exact = findTrail(config.items, pathname)
  // The page itself is the title below the breadcrumbs
  const trail = exact ? exact.slice(0, -1) : (findDeepestTrail(config.items, pathname) ?? [])

  const crumbs = [...root, ...trail.map((item) => ({ text: item.title, href: firstHref(item) }))]
  return crumbs.filter(
    (crumb, i) => i === 0 || crumb.text !== crumbs[i - 1].text || crumb.href !== crumbs[i - 1].href,
  )
}
