import { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'

// Builds the global sidebar from the sidebars that each section keeps next to
// its content (src/content/<section>/sidebar.ts).

export type SidebarEntry = Omit<SidebarLink, 'type'>
type SectionItem = SidebarLink | SidebarGroup | SidebarEntry

function isGroup(item: SectionItem): item is SidebarGroup {
  return 'type' in item && item.type === 'group'
}

/** Section groups become entries that fold open; links keep their href. */
export function toEntries(items: SectionItem[]): SidebarEntry[] {
  return items.map((item) => {
    if (isGroup(item)) {
      return { title: item.title, href: '', tags: item.tags, children: toEntries(item.children) }
    }
    const { title, href, tags, newSince, hidePlan, external, disabled, isActive, children } = item
    // A parent that links to its own first child only folds open; the child carries the link
    const duplicatesChild = !!children?.length && children[0].href === href
    return {
      title,
      href: duplicatesChild ? '' : href,
      tags,
      newSince,
      hidePlan,
      external,
      disabled,
      isActive,
      children: children ? toEntries(children) : undefined,
    }
  })
}

/** The item at a path of titles, e.g. `['Other Options', 'Client Toolkit']`. Fails the build if missing. */
export function pick(config: SidebarConfig, titles: string[]): SectionItem {
  let items: SectionItem[] = config.items
  let found: SectionItem | undefined
  for (const title of titles) {
    found = items.find((item) => item.title === title)
    if (!found) throw new Error(`Sidebar "${config.id}" has no item "${titles.join(' › ')}"`)
    items = found.children ?? []
  }
  return found as SectionItem
}

/** The children of the item at `titles`, as entries. */
export function childrenOf(config: SidebarConfig, titles: string[]): SidebarEntry[] {
  return toEntries(pick(config, titles).children ?? [])
}

/**
 * One section as a single entry that folds open. The items of `inline` groups
 * (usually "Get started") come first; the other groups follow as folding entries.
 */
export function section(
  title: string,
  config: SidebarConfig,
  options: { inline?: string[]; omit?: string[]; tags?: string[] } = {},
): SidebarEntry {
  const { inline = [], omit = [], tags } = options
  const children = config.items
    .filter((item) => !omit.includes(item.title))
    .flatMap((item) =>
      inline.includes(item.title) ? childrenOf(config, [item.title]) : toEntries([item]),
    )
  return { title, href: '', tags, children }
}
