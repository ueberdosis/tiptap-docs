import { SidebarConfig } from '@/types'

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
        // One entry: the changelog page leads to each package's full history
        { href: '/resources/changelog', title: 'Changelog' },
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
