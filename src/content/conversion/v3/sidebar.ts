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
      href: '/conversion/v3/content-reference/overview',
      title: 'Content reference',
      children: [
        {
          title: 'Overview',
          href: '/conversion/v3/content-reference/overview',
        },
        {
          title: 'Text and formatting',
          href: '/conversion/v3/content-reference/text-and-formatting/paragraphs',
          children: [
            {
              title: 'Paragraphs',
              href: '/conversion/v3/content-reference/text-and-formatting/paragraphs',
            },
            {
              title: 'Headings',
              href: '/conversion/v3/content-reference/text-and-formatting/headings',
            },
            {
              title: 'Text alignment',
              href: '/conversion/v3/content-reference/text-and-formatting/text-alignment',
            },
            {
              title: 'Bold, italic, underline, strike',
              href: '/conversion/v3/content-reference/text-and-formatting/bold-italic-underline-strike',
            },
            {
              title: 'Subscript and superscript',
              href: '/conversion/v3/content-reference/text-and-formatting/subscript-superscript',
            },
            {
              title: 'Text color and highlight',
              href: '/conversion/v3/content-reference/text-and-formatting/text-color-highlight',
            },
            {
              title: 'Font family and size',
              href: '/conversion/v3/content-reference/text-and-formatting/font-family-size',
            },
            {
              title: 'Lists',
              href: '/conversion/v3/content-reference/text-and-formatting/lists',
            },
            {
              title: 'Task lists',
              href: '/conversion/v3/content-reference/text-and-formatting/task-lists',
            },
            {
              title: 'Tabs',
              href: '/conversion/v3/content-reference/text-and-formatting/tabs',
            },
          ],
        },
        {
          title: 'Structures and media',
          href: '/conversion/v3/content-reference/structures-and-media/tables',
          children: [
            {
              title: 'Tables',
              href: '/conversion/v3/content-reference/structures-and-media/tables',
            },
            {
              title: 'Images',
              href: '/conversion/v3/content-reference/structures-and-media/images',
            },
            {
              title: 'Hyperlinks and bookmarks',
              href: '/conversion/v3/content-reference/structures-and-media/hyperlinks-bookmarks',
            },
            {
              title: 'Block elements',
              href: '/conversion/v3/content-reference/structures-and-media/block-elements',
            },
            {
              title: 'Math and equations',
              href: '/conversion/v3/content-reference/structures-and-media/math-equations',
            },
            {
              title: 'Footnotes and endnotes',
              href: '/conversion/v3/content-reference/structures-and-media/footnotes-endnotes',
            },
            {
              title: 'Comments',
              href: '/conversion/v3/content-reference/structures-and-media/comments',
            },
            {
              title: 'Word styles',
              href: '/conversion/v3/content-reference/structures-and-media/word-styles',
            },
          ],
        },
        {
          title: 'Page layout',
          href: '/conversion/v3/content-reference/page-layout/headers-footers',
          children: [
            {
              title: 'Headers and footers',
              href: '/conversion/v3/content-reference/page-layout/headers-footers',
            },
            {
              title: 'Page breaks',
              href: '/conversion/v3/content-reference/page-layout/page-breaks',
            },
            {
              title: 'Page structure',
              href: '/conversion/v3/content-reference/page-layout/page-structure',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/v3/import/docx/editor-extension',
      title: 'Import DOCX',
      children: [
        {
          title: 'Editor extension',
          href: '/conversion/v3/import/docx/editor-extension',
        },
        {
          title: 'Import with Page Layout',
          href: '/conversion/v3/import/docx/page-layout',
        },
        {
          title: 'Import without Page Layout',
          href: '/conversion/v3/import/docx/without-page-layout',
        },
        {
          title: 'CSS styles',
          href: '/conversion/v3/import/docx/css-styles',
        },
        {
          title: 'Image handling',
          href: '/conversion/v3/import/docx/image-handling',
        },
        {
          title: 'Custom node mapping',
          href: '/conversion/v3/import/docx/custom-node-mapping',
        },
        {
          title: 'Tracked changes',
          href: '/conversion/v3/import/docx/tracked-changes',
        },
        {
          title: 'Task lists',
          href: '/conversion/v3/import/docx/task-lists',
        },
        {
          title: 'Warnings and errors',
          href: '/conversion/v3/import/docx/warnings-and-errors',
        },
        {
          title: 'API',
          href: '/conversion/v3/import/docx/api',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/v3/export/docx/editor-extension',
      title: 'Export DOCX',
      children: [
        {
          title: 'Editor extension',
          href: '/conversion/v3/export/docx/editor-extension',
        },
        {
          title: 'Control the output',
          href: '/conversion/v3/export/docx/usage',
        },
        {
          title: 'Render custom nodes',
          href: '/conversion/v3/export/docx/custom-nodes',
        },
        {
          title: 'Custom node builder',
          href: '/conversion/v3/export/docx/custom-node-builder',
        },
        {
          title: 'API',
          href: '/conversion/v3/export/docx/api',
        },
        {
          title: 'Types',
          href: '/conversion/v3/export/docx/types',
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
          title: 'Export DOCX',
          href: '/conversion/v3/rest-api/export-docx',
        },
      ],
    },
  ],
}
