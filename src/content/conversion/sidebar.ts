import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'conversion',
  rootHref: '/conversion/getting-started/overview',
  title: 'Conversion',
  items: [
    {
      type: 'group',
      href: '/conversion/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/conversion/getting-started/overview',
        },
        {
          title: 'Authenticate',
          href: '/conversion/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/import-export',
      title: 'Import & Export',
      children: [
        {
          title: 'DOCX',
          href: '/conversion/import-export/docx',
          children: [
            {
              title: 'Editor import',
              href: '/conversion/import-export/docx/editor-import',
            },
            {
              title: 'Editor export',
              href: '/conversion/import-export/docx/editor-export',
            },
            {
              title: 'REST API',
              href: '/conversion/import-export/docx/rest-api',
            },
            {
              title: 'Convert custom nodes',
              href: '/conversion/import-export/docx/custom-node-conversion',
            },
            {
              title: 'Convert custom marks',
              href: '/conversion/import-export/docx/custom-mark-conversion',
            },
            {
              title: 'Export styles',
              href: '/conversion/import-export/docx/export-styles',
            },
            {
              title: 'Preserve images',
              href: '/conversion/import-export/docx/preserve-images',
            },
          ],
        },
        {
          title: 'ODT',
          href: '/conversion/import-export/odt',
        },
        {
          title: 'Markdown',
          href: '/conversion/import-export/markdown',
        },
        {
          title: 'HTML',
          href: '/conversion/usage/rest-api',
        },
      ],
    },
  ],
}
