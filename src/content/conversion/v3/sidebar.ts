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
          title: 'Migrate from Conversion v2',
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
              title: 'Review an import before it applies',
              href: '/conversion/v3/docx/import/review',
            },
            {
              title: 'Images in imported files',
              href: '/conversion/v3/docx/import/images',
            },
            {
              title: 'Word styles as CSS',
              href: '/conversion/v3/docx/import/word-styles',
            },
          ],
        },
        {
          title: 'Export DOCX',
          href: '/conversion/v3/docx/export',
        },
        {
          title: 'Export styles and fonts',
          href: '/conversion/v3/docx/export-styles',
        },
        {
          title: 'What Word elements become',
          href: '/conversion/v3/docx/elements',
          children: [
            {
              title: 'Text formatting',
              href: '/conversion/v3/docx/elements/text-formatting',
            },
            {
              title: 'Paragraphs and alignment',
              href: '/conversion/v3/docx/elements/paragraphs',
            },
            {
              title: 'Headings and Word styles',
              href: '/conversion/v3/docx/elements/headings-and-styles',
            },
            {
              title: 'Lists and task lists',
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
              title: 'Footnotes and endnotes',
              href: '/conversion/v3/docx/elements/footnotes',
            },
          ],
        },
        {
          title: 'Word files with Page Layout',
          href: '/conversion/v3/docx/page-layout',
          children: [
            {
              title: 'Sections and page setup',
              href: '/conversion/v3/docx/page-layout/sections',
            },
            {
              title: 'Headers and footers',
              href: '/conversion/v3/docx/page-layout/headers-and-footers',
            },
          ],
        },
        {
          title: 'Tracked changes and comments',
          href: '/conversion/v3/docx/tracked-changes-and-comments',
        },
        {
          title: 'Custom nodes in Word files',
          href: '/conversion/v3/docx/custom-nodes',
          children: [
            {
              title: 'Custom nodes on import',
              href: '/conversion/v3/docx/custom-nodes/import',
            },
            {
              title: 'Custom node DSL',
              href: '/conversion/v3/docx/custom-nodes/dsl',
            },
          ],
        },
        {
          title: 'Content the editor cannot show',
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
