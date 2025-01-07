import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'collaboration',
  rootHref: '/collaboration/getting-started/overview',
  title: 'Collaboration',
  items: [
    {
      type: 'group',
      href: '/collaboration/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/collaboration/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/collaboration/getting-started/install',
        },
        {
          title: 'Authenticate',
          href: '/collaboration/getting-started/authenticate',
        },
      ],
    },
    {
      type: 'group',
      href: '/collaboration/provider',
      title: 'Provider',
      children: [
        {
          title: 'Integration',
          href: '/collaboration/provider/integration',
        },
        {
          title: 'Events',
          href: '/collaboration/provider/events',
        },
      ],
    },
    {
      type: 'group',
      href: '/collaboration/core-concepts',
      title: 'Features',
      children: [
        {
          title: 'Awareness',
          href: '/collaboration/core-concepts/awareness',
        },
        {
          title: 'Webhooks',
          href: '/collaboration/core-concepts/webhooks',
        },
      ],
    },
  ],
}
