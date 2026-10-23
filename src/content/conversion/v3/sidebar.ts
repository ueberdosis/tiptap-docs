import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'conversion-v3',
  rootHref: '/conversion/v3/getting-started/overview',
  title: 'Conversion',
  items: [
    {
      type: 'group',
      href: '/conversion/v3/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/conversion/v3/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/conversion/v3/getting-started/install',
        },
        {
          title: 'Feature support matrix',
          href: '/conversion/v3/getting-started/feature-support-matrix',
        },
        {
          title: 'Migrate export from 0.x',
          href: '/conversion/v3/getting-started/migrate-export-from-0x',
        },
        {
          title: 'Migrate import from 0.x',
          href: '/conversion/v3/getting-started/migrate-import-from-0x',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/v3/content-reference',
      title: 'Content reference',
      children: [],
    },
    {
      type: 'group',
      href: '/conversion/v3/import-docx',
      title: 'Import DOCX',
      children: [],
    },
    {
      type: 'group',
      href: '/conversion/v3/export-docx',
      title: 'Export DOCX',
      children: [],
    },
    {
      type: 'group',
      href: '/conversion/v3/rest-api',
      title: 'REST API',
      children: [],
    },
  ],
}
