import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'conversion',
  rootHref: '/conversion/getting-started/overview',
  title: 'Conversion',
  items: [
    {
      type: 'group',
      href: '/conversion/getting-started',
      title: 'get started',
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
      href: '/conversion/import',
      title: 'Import',
      tags: ['Start'],
      children: [
        {
          title: 'DOCX',
          href: '/conversion/import/docx/editor-import',
          beta: true,
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/import/docx/editor-import',
            },
            {
              title: 'Convert custom nodes',
              href: '/conversion/import/docx/custom-node-conversion',
            },
            {
              title: 'Convert custom marks',
              href: '/conversion/import/docx/custom-mark-conversion',
            },
            {
              title: 'Preserve images',
              href: '/conversion/import/docx/preserve-images',
            },
            {
              title: 'REST API',
              href: '/conversion/import/docx/rest-api',
            },
          ],
        },
        {
          title: 'Markdown',
          href: '/conversion/import/markdown/rest-api',
          beta: true,
          children: [
            {
              title: 'REST API',
              href: '/conversion/import/markdown/rest-api',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/export',
      title: 'Export',
      tags: ['Start'],
      children: [
        {
          title: 'DOCX',
          href: '/conversion/export/docx/editor-export',
          beta: true,
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/docx/editor-export',
            },
            {
              title: 'Headers & Footers',
              href: '/conversion/export/docx/headers-footers',
            },
            {
              title: 'Custom page layout',
              href: '/conversion/export/docx/custom-page-layout',
            },
            {
              title: 'Convert custom nodes',
              href: '/conversion/export/docx/custom-node-conversion',
            },
            {
              title: 'Export styles',
              href: '/conversion/export/docx/export-styles',
            },
            {
              title: 'REST API',
              href: '/conversion/export/docx/rest-api',
            },
          ],
        },
        {
          title: 'PDF',
          href: '/conversion/export/pdf/editor-export',
          beta: true,
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/pdf/editor-export',
            },
            {
              title: 'Headers & Footers',
              href: '/conversion/export/pdf/headers-footers',
            },
            {
              title: 'Custom page layout',
              href: '/conversion/export/pdf/custom-page-layout',
            },
            {
              title: 'Convert custom nodes',
              href: '/conversion/export/pdf/custom-node-conversion',
            },
            {
              title: 'Export styles',
              href: '/conversion/export/pdf/export-styles',
            },
            {
              title: 'REST API',
              href: '/conversion/export/pdf/rest-api',
            },
          ],
        },
        {
          title: 'ODT',
          href: '/conversion/export/odt/editor-export',
          beta: true,
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/odt/editor-export',
            },
            {
              title: 'Headers & Footers',
              href: '/conversion/export/odt/headers-footers',
            },
            {
              title: 'Custom page layout',
              href: '/conversion/export/odt/custom-page-layout',
            },
            {
              title: 'Convert custom nodes',
              href: '/conversion/export/odt/custom-node-conversion',
            },
            {
              title: 'Export styles',
              href: '/conversion/export/odt/export-styles',
            },
            {
              title: 'REST API',
              href: '/conversion/export/odt/rest-api',
            },
          ],
        },
        {
          title: 'EPUB',
          href: '/conversion/export/epub/editor-export',
          beta: true,
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/epub/editor-export',
            },
            {
              title: 'Headers & Footers',
              href: '/conversion/export/epub/headers-footers',
            },
            {
              title: 'Custom page layout',
              href: '/conversion/export/epub/custom-page-layout',
            },
            {
              title: 'Convert custom nodes',
              href: '/conversion/export/epub/custom-node-conversion',
            },
            {
              title: 'Export styles',
              href: '/conversion/export/epub/export-styles',
            },
            {
              title: 'REST API',
              href: '/conversion/export/epub/rest-api',
            },
          ],
        },
        {
          title: 'DOC',
          href: '/conversion/export/doc/editor-export',
          beta: true,
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/doc/editor-export',
            },
            {
              title: 'Headers & Footers',
              href: '/conversion/export/doc/headers-footers',
            },
            {
              title: 'Custom page layout',
              href: '/conversion/export/doc/custom-page-layout',
            },
            {
              title: 'Convert custom nodes',
              href: '/conversion/export/doc/custom-node-conversion',
            },
            {
              title: 'Export styles',
              href: '/conversion/export/doc/export-styles',
            },
            {
              title: 'REST API',
              href: '/conversion/export/doc/rest-api',
            },
          ],
        },
        {
          title: 'Markdown',
          href: '/conversion/export/markdown/editor-export',
          beta: true,
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/markdown/editor-export',
            },
            {
              title: 'REST API',
              href: '/conversion/export/markdown/rest-api',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/legacy',
      title: 'Legacy Import/Export',
      children: [
        {
          title: 'DOCX',
          href: '/conversion/legacy/overview',
          tags: ['Deprecated'],
        },
        {
          title: 'ODT',
          href: '/conversion/legacy/odt/editor-extensions',
          tags: ['Deprecated'],
          children: [
            {
              title: 'Editor extensions',
              href: '/conversion/legacy/odt/editor-extensions',
            },
            {
              title: 'REST API',
              href: '/conversion/legacy/odt/rest-api',
            },
          ],
        },
        {
          title: 'Markdown',
          href: '/conversion/legacy/markdown/editor-extensions',
          tags: ['Deprecated'],
          children: [
            {
              title: 'Editor extensions',
              href: '/conversion/legacy/markdown/editor-extensions',
            },
            {
              title: 'REST API',
              href: '/conversion/legacy/markdown/rest-api',
            },
          ],
        },
      ],
    },
  ],
}
