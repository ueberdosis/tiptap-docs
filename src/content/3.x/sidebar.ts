import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'all-docs',
  rootHref: '/3.x',
  title: 'Home',
  items: [
    {
      type: 'group',
      title: 'Getting started',
      href: '/3.x/getting-started',
      children: [
        {
          href: '/3.x',
          title: 'Overview',
        },
      ],
    },
    {
      type: 'group',
      title: 'Browse by feature',
      href: '/3.x/suite-docs',
      children: [
        {
          href: '/3.x/editor/getting-started/overview',
          title: 'Editor',
        },
        {
          href: '/3.x/collaboration/getting-started/overview',
          title: 'Collaboration',
        },
        {
          href: '/3.x/content-ai/getting-started/overview',
          title: 'Content AI',
        },
        {
          href: '/3.x/comments/getting-started/overview',
          title: 'Comments',
        },
        {
          href: '/3.x/collaboration/documents',
          title: 'Documents',
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/3.x/resources',
      children: [
        {
          href: '/3.x/guides',
          title: 'Guides',
        },
        {
          href: '/3.x/examples',
          title: 'Examples',
        },
        {
          href: '/3.x/resources/contributing',
          title: 'Contributing',
        },
        {
          href: '/3.x/resources/changelog',
          title: 'Editor changelog',
        },
        {
          href: '/3.x/resources/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
