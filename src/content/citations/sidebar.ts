import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'citations',
  rootHref: '/citations/getting-started/overview',
  title: 'Citations',
  items: [
    {
      type: 'group',
      title: 'Get started',
      href: '/citations/getting-started',
      children: [
        { title: 'Overview', href: '/citations/getting-started/overview' },
        { title: 'Install', href: '/citations/getting-started/install' },
      ],
    },
    { type: 'link', title: 'Usage', href: '/citations/guides/usage' },
    { type: 'link', title: 'API reference', href: '/citations/api-reference' },
  ],
}
