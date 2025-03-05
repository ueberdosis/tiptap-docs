import { SidebarConfig } from '@/types'

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
          href: '/content-ai/getting-started/overview',
          title: 'Content AI',
        },
        {
          href: '/content-ai/getting-started/overview',
          title: 'Content AI',
        },
        {
          href: '/collaboration/documents/history',
          title: 'History',
        },
        {
          href: '/conversion/getting-started/overview',
          title: 'Conversion',
        },
        {
          href: '/collaboration/documents/semantic-search',
          title: 'Semantic Search',
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/resources',
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
          href: '/resources/contributing',
          title: 'Contributing',
        },
        {
          href: '/resources/changelog',
          title: 'Editor changelog',
        },
        {
          href: '/resources/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
