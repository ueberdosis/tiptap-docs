import { Plan, Status, planFromLabel, statusFromLabel } from '@/content/plans'
import { sidebarConfig } from '@/content/sidebar'

type Entry = { href: string; tags?: string[]; children?: Entry[] }
type Labels = { plan?: Plan; status?: Status }

/** What an entry's tags add to what it inherited. "Paid" names no plan, so it passes nothing on. */
function withTags(tags: string[] | undefined, inherited: Labels): Labels {
  const plan = tags?.map(planFromLabel).find(Boolean)
  const status = tags?.map(statusFromLabel).find(Boolean)
  return { plan: plan ?? inherited.plan, status: status ?? inherited.status }
}

const isBelow = (route: string, href: string) =>
  !!href && href !== '/' && route.startsWith(`${href}/`)

/**
 * The plan and status a page inherits from the sidebar entries above it, so a
 * sub-page of a paid feature says so in its header. A page outside the sidebar
 * takes them from the deepest entry whose URL it lies below.
 */
export function inheritedLabels(route: string): Labels {
  let exact: Labels | undefined
  let below: { depth: number; labels: Labels } | undefined
  const walk = (entries: Entry[], inherited: Labels, depth: number) => {
    for (const entry of entries) {
      const labels = withTags(entry.tags, inherited)
      if (!exact && entry.href === route) exact = labels
      if (isBelow(route, entry.href) && (!below || depth > below.depth)) below = { depth, labels }
      if (entry.children) walk(entry.children, labels, depth + 1)
    }
  }
  walk(sidebarConfig.items, {}, 0)
  return exact ?? below?.labels ?? {}
}
