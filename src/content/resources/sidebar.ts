import fs from 'fs'
import path from 'path'
import { SidebarConfig } from '@/types'

function loadChangelogSidebarItems(): Array<{ href: string; title: string }> {
  try {
    const filePath = path.join(
      process.cwd(),
      'src/content/resources/changelog/_data/sidebar-items.json',
    )
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return []
  }
}

const changelogChildren = loadChangelogSidebarItems()

export const sidebarConfig: SidebarConfig = {
  id: 'all-docs',
  rootHref: '/',
  title: 'Home',
  items: [
    {
      type: 'group',
      title: 'Getting started',
      href: '/getting-started',
      children: [
        {
          href: '/',
          title: 'Overview',
        },
        {
          href: '/resources/whats-new',
          title: "What's new in 3.0",
        },
      ],
    },
    {
      type: 'group',
      title: 'Browse by feature',
      href: '/suite-docs',
      children: [
        {
          href: '/editor/getting-started/overview',
          title: 'Editor',
        },
        {
          href: '/collaboration/getting-started/overview',
          title: 'Collaboration',
        },
        {
          href: '/comments/getting-started/overview',
          title: 'Comments',
        },
        {
          href: '/content-ai/getting-started/overview',
          title: 'Content AI',
        },
        {
          href: '/collaboration/documents/snapshot',
          title: 'Snapshots',
        },
        {
          href: '/conversion/getting-started/overview',
          title: 'Conversion',
        },
        {
          href: '/pages/getting-started/overview',
          title: 'Pages',
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/',
      children: [
        {
          href: '/guides',
          title: 'Guides',
        },
        {
          href: '/examples',
          title: 'Examples',
        },
        {
          href: '/resources/tiptap-trial',
          title: 'Tiptap trial',
        },
        {
          href: '/resources/contributing',
          title: 'Contributing',
        },
        {
          href: '/resources/changelog',
          title: 'Editor changelog',
          children: changelogChildren,
        },
        {
          href: 'https://tiptap.dev/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
