import fs from 'fs'
import path from 'path'
import { SidebarConfig } from '@/types'

function isSidebarItem(value: unknown): value is { href: string; title: string } {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return typeof item.href === 'string' && typeof item.title === 'string'
}

function loadChangelogSidebarItems(): Array<{ href: string; title: string }> {
  try {
    const filePath = path.join(
      process.cwd(),
      'src/content/resources/changelog/_data/sidebar-items.json',
    )
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    return Array.isArray(data) ? data.filter(isSidebarItem) : []
  } catch {
    return []
  }
}

const changelogChildren = loadChangelogSidebarItems()

// The Resources part of the global sidebar (src/content/sidebar.ts)
export const sidebarConfig: SidebarConfig = {
  id: 'resources',
  rootHref: '/resources/changelog',
  title: 'Resources',
  items: [
    {
      type: 'group',
      title: 'Resources',
      href: '/resources',
      children: [
        {
          href: '/resources/agent-skill',
          title: 'Agent skill',
        },
        {
          href: '/resources/changelog',
          title: 'Editor changelog',
          children: changelogChildren.length > 0 ? changelogChildren : undefined,
        },
        {
          href: '/resources/incidents',
          title: 'Incidents',
        },
        {
          href: '/resources/contributing',
          title: 'Contributing',
        },
        {
          href: 'https://tiptap.dev/pro-license',
          title: 'Pro license',
          external: true,
        },
      ],
    },
  ],
}
