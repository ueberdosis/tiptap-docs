import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'hocuspocus',
  rootHref: '/hocuspocus/getting-started/overview',
  title: 'Hocuspocus',
  items: [
    {
      type: 'group',
      href: '/hocuspocus/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/hocuspocus/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/hocuspocus/getting-started/install',
        },
        {
          title: 'About the project',
          href: '/hocuspocus/getting-started/sponsor',
        },
        {
          title: 'Contributing',
          href: '/hocuspocus/getting-started/contributing',
        },
      ],
    },
  ],
}
