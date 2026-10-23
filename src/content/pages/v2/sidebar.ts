import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'pages-v2',
  rootHref: '/pages/v2/getting-started/overview',
  title: 'Pages',
  items: [
    {
      type: 'group',
      href: '/pages/v2/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/pages/v2/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/pages/v2/getting-started/install',
        },
        {
          title: 'React',
          href: '/pages/v2/getting-started/react',
        },
        {
          title: 'Toolbar',
          href: '/pages/v2/getting-started/toolbar',
        },
        {
          title: 'Components',
          href: '/pages/v2/getting-started/components',
        },
        {
          title: 'Live demo',
          href: '/pages/v2/getting-started/live-demo',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/v2/core-concepts',
      title: 'Core concepts',
      children: [],
    },
    {
      type: 'group',
      href: '/pages/v2/api',
      title: 'API',
      children: [
        {
          title: 'Options',
          href: '/pages/v2/api/options',
        },
        {
          title: 'Commands',
          href: '/pages/v2/api/commands',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/v2/extensions',
      title: 'Extensions',
      children: [],
    },
    {
      type: 'group',
      href: '/pages/v2/guides',
      title: 'Guides',
      children: [],
    },
  ],
}
