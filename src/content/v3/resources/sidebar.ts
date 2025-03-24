import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'all-docs',
  rootHref: '/v3/',
  title: 'Home',
  items: [
    {
      type: 'group',
      title: 'Getting started',
      href: '/v3/getting-started',
      children: [
        {
          href: '/v3/',
          title: 'Overview',
        },
      ],
    },
    {
      type: 'group',
      title: 'Browse by feature',
      href: '/v3/suite-docs',
      children: [
        {
          href: '/v3/editor/getting-started/overview',
          title: 'Editor',
        },
        {
          href: '/v3/collaboration/getting-started/overview',
          title: 'Collaboration',
        },
        {
          href: '/v3/content-ai/getting-started/overview',
          title: 'Content AI',
        },
        {
          href: '/v3/comments/getting-started/overview',
          title: 'Comments',
        },
        {
          href: '/v3/collaboration/documents',
          title: 'Documents',
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/v3/resources',
      children: [
        {
          href: '/v3/guides',
          title: 'Guides',
        },
        {
          href: '/v3/examples',
          title: 'Examples',
        },
        {
          href: '/v3/resources/contributing',
          title: 'Contributing',
        },
        {
          href: '/v3/resources/changelog',
          title: 'Editor changelog',
        },
        {
          href: '/v3/resources/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
