import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'collaboration',
  rootHref: '/3.x/collaboration/getting-started/overview',
  title: 'Collaboration',
  items: [
    {
      type: 'group',
      href: '/3.x/collaboration/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/3.x/collaboration/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/3.x/collaboration/getting-started/install',
        },
        {
          title: 'Authenticate',
          href: '/3.x/collaboration/getting-started/authenticate',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/collaboration/provider',
      title: 'Provider',
      children: [
        {
          title: 'Integration',
          href: '/3.x/collaboration/provider/integration',
        },
        {
          title: 'Events',
          href: '/3.x/collaboration/provider/events',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/collaboration/core-concepts',
      title: 'Features',
      children: [
        {
          title: 'Awareness',
          href: '/3.x/collaboration/core-concepts/awareness',
        },
        {
          title: 'Webhooks',
          href: '/3.x/collaboration/core-concepts/webhooks',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/collaboration/documents',
      title: 'Documents',
      children: [
        {
          title: 'Overview',
          href: '/3.x/collaboration/documents',
        },
        {
          title: 'REST API',
          href: '/3.x/collaboration/documents/rest-api',
        },
        {
          title: 'Snapshots',
          href: '/3.x/collaboration/documents/snapshot',
        },
        {
          title: 'Compare Snapshots',
          href: '/3.x/collaboration/documents/snapshot-compare',
        },
        {
          title: 'Inject content',
          href: '/3.x/collaboration/documents/content-injection',
        },
        {
          title: 'Conversion',
          href: '/3.x/collaboration/documents/conversion',
          tags: ['Beta'],
        },
        {
          title: 'Semantic Search',
          href: '/3.x/collaboration/documents/semantic-search',
          tags: ['Beta'],
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/collaboration/operations',
      title: 'Ops',
      children: [
        {
          title: 'Configure runtime',
          href: '/3.x/collaboration/operations/configure',
        },
        {
          title: 'Metrics',
          href: '/3.x/collaboration/operations/metrics',
        },
      ],
    },
  ],
}
