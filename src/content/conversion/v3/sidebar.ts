import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'conversion-v3',
  rootHref: '/conversion/v3/getting-started/overview',
  title: 'Conversion',
  items: [
    {
      type: 'group',
      href: '/conversion/v3/getting-started/overview',
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
          title: 'Migrate from v2',
          href: '/conversion/v3/getting-started/migrate-from-v2',
          children: [
            {
              title: 'Export',
              href: '/conversion/v3/getting-started/migrate-from-v2/export',
            },
            {
              title: 'Import',
              href: '/conversion/v3/getting-started/migrate-from-v2/import',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/v3/docx/import',
      title: 'Word files (DOCX)',
      children: [
        {
          title: 'Import DOCX',
          href: '/conversion/v3/docx/import',
          children: [
            {
              title: 'Review the import',
              href: '/conversion/v3/docx/import/review',
            },
            {
              title: 'Images',
              href: '/conversion/v3/docx/import/images',
            },
            {
              title: 'Word styles',
              href: '/conversion/v3/docx/import/word-styles',
            },
          ],
        },
        {
          title: 'Export DOCX',
          href: '/conversion/v3/docx/export',
          children: [
            {
              title: 'Styles and fonts',
              href: '/conversion/v3/docx/export/styles-and-fonts',
            },
            {
              title: 'Page size and margins',
              href: '/conversion/v3/docx/export/page-size-and-margins',
            },
          ],
        },
        {
          title: 'Word elements',
          href: '/conversion/v3/docx/elements',
          children: [
            {
              title: 'Text formatting',
              href: '/conversion/v3/docx/elements/text-formatting',
            },
            {
              title: 'Paragraphs',
              href: '/conversion/v3/docx/elements/paragraphs',
            },
            {
              title: 'Headings',
              href: '/conversion/v3/docx/elements/headings-and-styles',
            },
            {
              title: 'Lists',
              href: '/conversion/v3/docx/elements/lists',
            },
            {
              title: 'Tables',
              href: '/conversion/v3/docx/elements/tables',
            },
            {
              title: 'Images and math',
              href: '/conversion/v3/docx/elements/images-and-math',
            },
            {
              title: 'Links and bookmarks',
              href: '/conversion/v3/docx/elements/links-and-bookmarks',
            },
            {
              title: 'Footnotes',
              href: '/conversion/v3/docx/elements/footnotes',
            },
            {
              title: 'Sections',
              href: '/conversion/v3/docx/elements/sections',
            },
            {
              title: 'Headers and footers',
              href: '/conversion/v3/docx/elements/headers-and-footers',
            },
            {
              title: 'Tracked changes',
              href: '/conversion/v3/docx/elements/tracked-changes',
            },
            {
              title: 'Comments',
              href: '/conversion/v3/docx/elements/comments',
            },
          ],
        },
        {
          title: 'Page Layout',
          href: '/conversion/v3/docx/page-layout',
        },
        {
          title: 'Custom nodes',
          href: '/conversion/v3/docx/custom-nodes',
          children: [
            {
              title: 'On import',
              href: '/conversion/v3/docx/custom-nodes/import',
            },
            {
              title: 'DSL reference',
              href: '/conversion/v3/docx/custom-nodes/dsl',
            },
          ],
        },
        {
          title: 'Preserved content',
          href: '/conversion/v3/docx/preserved-content',
        },
        {
          title: 'Import options',
          href: '/conversion/v3/docx/import-options',
        },
        {
          title: 'Export options',
          href: '/conversion/v3/docx/export-options',
          children: [
            {
              title: 'Export types',
              href: '/conversion/v3/docx/export-options/types',
            },
          ],
        },
      ],
    },
    {
      type: 'link',
      href: '/conversion/v3/pdf',
      title: 'PDF',
    },
    {
      type: 'group',
      href: '/conversion/v3/doc-odt-epub',
      title: 'Other formats',
      children: [
        {
          title: 'DOC, ODT and EPUB',
          href: '/conversion/v3/doc-odt-epub',
        },
        {
          title: 'Markdown',
          href: '/conversion/v3/markdown',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/v3/reference/commands',
      title: 'Reference',
      children: [
        {
          title: 'Commands',
          href: '/conversion/v3/reference/commands',
        },
        {
          title: 'Warnings',
          href: '/conversion/v3/reference/warnings',
        },
        {
          title: 'Errors',
          href: '/conversion/v3/reference/errors',
        },
        {
          title: 'Limitations',
          href: '/conversion/v3/reference/limitations',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/v3/rest-api/overview',
      title: 'REST API',
      children: [
        {
          title: 'Overview',
          href: '/conversion/v3/rest-api/overview',
        },
        {
          title: 'Import DOCX',
          href: '/conversion/v3/rest-api/import-docx',
        },
        {
          title: 'Export DOCX',
          href: '/conversion/v3/rest-api/export-docx',
        },
        {
          title: 'Export PDF',
          href: '/conversion/v3/rest-api/export-pdf',
        },
      ],
    },
  ],
}
