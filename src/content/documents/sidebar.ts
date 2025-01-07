import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'documents',
  rootHref: '/documents/getting-started/overview',
  title: 'Documents',
  items: [
    {
      type: 'group',
      href: '/documents/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/documents/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/documents/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/documents/features',
      title: 'Features',
      children: [
        {
          title: 'REST API',
          href: '/documents/features/rest-api',
        },
        {
          title: 'Compare Snapshots',
          href: '/documents/features/snapshot-compare',
        },
        {
          title: 'Conversion',
          href: '/documents/features/conversion',
          tags: ['Beta'],
        },
        {
          title: 'History',
          href: '/documents/features/history',
        },
        {
          title: 'Inject content',
          href: '/documents/features/content-injection',
        },
        {
          title: 'Semantic Search',
          href: '/documents/features/semantic-search',
          tags: ['Beta'],
        },
      ],
    },
    {
      type: 'group',
      href: '/documents/operations',
      title: 'Ops',
      children: [
        {
          title: 'Configure runtime',
          href: '/documents/operations/configure',
        },
        {
          title: 'Metrics',
          href: '/documents/operations/metrics',
        },
      ],
    },
  ],
}
