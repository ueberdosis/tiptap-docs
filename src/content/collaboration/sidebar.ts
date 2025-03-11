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
    {
      type: 'group',
      href: '/collaboration/documents',
      title: 'Documents',
      children: [
        {
          title: 'Overview',
          href: '/collaboration/documents',
        },
        {
          title: 'REST API',
          href: '/collaboration/documents/rest-api',
        },
        {
          title: 'Snapshots',
          href: '/collaboration/documents/snapshot',
        },
        {
          title: 'Compare Snapshots',
          href: '/collaboration/documents/snapshot-compare',
        },
        {
          title: 'Inject content',
          href: '/collaboration/documents/content-injection',
        },
        {
          title: 'Conversion',
          href: '/collaboration/documents/conversion',
          tags: ['Beta'],
        },
        {
          title: 'Semantic Search',
          href: '/collaboration/documents/semantic-search',
          tags: ['Beta'],
        },
      ],
    },
    {
      type: 'group',
      href: '/collaboration/operations',
      title: 'Ops',
      children: [
        {
          title: 'Configure runtime',
          href: '/collaboration/operations/configure',
        },
        {
          title: 'Metrics',
          href: '/collaboration/operations/metrics',
        },
      ],
    },
  ],
}
