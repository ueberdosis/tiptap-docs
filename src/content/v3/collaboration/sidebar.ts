import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'collaboration',
  rootHref: '/v3/collaboration/getting-started/overview',
  title: 'Collaboration',
  items: [
    {
      type: 'group',
      href: '/v3/collaboration/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/v3/collaboration/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/v3/collaboration/getting-started/install',
        },
        {
          title: 'Authenticate',
          href: '/v3/collaboration/getting-started/authenticate',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/collaboration/provider',
      title: 'Provider',
      children: [
        {
          title: 'Integration',
          href: '/v3/collaboration/provider/integration',
        },
        {
          title: 'Events',
          href: '/v3/collaboration/provider/events',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/collaboration/core-concepts',
      title: 'Features',
      children: [
        {
          title: 'Awareness',
          href: '/v3/collaboration/core-concepts/awareness',
        },
        {
          title: 'Webhooks',
          href: '/v3/collaboration/core-concepts/webhooks',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/collaboration/documents',
      title: 'Documents',
      children: [
        {
          title: 'Overview',
          href: '/v3/collaboration/documents',
        },
        {
          title: 'REST API',
          href: '/v3/collaboration/documents/rest-api',
        },
        {
          title: 'Snapshots',
          href: '/v3/collaboration/documents/snapshot',
        },
        {
          title: 'Compare Snapshots',
          href: '/v3/collaboration/documents/snapshot-compare',
        },
        {
          title: 'Inject content',
          href: '/v3/collaboration/documents/content-injection',
        },
        {
          title: 'Conversion',
          href: '/v3/collaboration/documents/conversion',
          tags: ['Beta'],
        },
        {
          title: 'Semantic Search',
          href: '/v3/collaboration/documents/semantic-search',
          tags: ['Beta'],
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/collaboration/operations',
      title: 'Ops',
      children: [
        {
          title: 'Configure runtime',
          href: '/v3/collaboration/operations/configure',
        },
        {
          title: 'Metrics',
          href: '/v3/collaboration/operations/metrics',
        },
      ],
    },
  ],
}
