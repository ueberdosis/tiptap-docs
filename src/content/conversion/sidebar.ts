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
          title: 'Supported features',
          href: '/conversion/getting-started/feature-support-matrix',
          tags: ['New'],
          disabled: true,
        },
        {
          title: 'Authenticate',
          href: '/conversion/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/content-types',
      title: 'Content types',
      tags: ['New'],
      children: [
        {
          title: 'Overview',
          href: '/conversion/content-types/overview',
          disabled: true,
        },
        {
          title: 'Text & Formatting',
          href: '/conversion/content-types/text-and-formatting/headings',
          children: [
            {
              title: 'Paragraphs',
              href: '/conversion/content-types/text-and-formatting/paragraphs',
              disabled: true,
            },
            {
              title: 'Headings',
              href: '/conversion/content-types/text-and-formatting/headings',
            },
            {
              title: 'Text alignment',
              href: '/conversion/content-types/text-and-formatting/text-alignment',
              disabled: true,
            },
            {
              title: 'Bold, italic, underline, strike',
              href: '/conversion/content-types/text-and-formatting/bold-italic-underline-strike',
              disabled: true,
            },
            {
              title: 'Subscript & superscript',
              href: '/conversion/content-types/text-and-formatting/subscript-superscript',
              disabled: true,
            },
            {
              title: 'Text color & highlight',
              href: '/conversion/content-types/text-and-formatting/text-color-highlight',
              disabled: true,
            },
            {
              title: 'Font family & size',
              href: '/conversion/content-types/text-and-formatting/font-family-size',
              disabled: true,
            },
          ],
        },
        {
          title: 'Structures & Media',
          href: '/conversion/content-types/structures-and-media/bullet-lists',
          disabled: true,
          children: [
            {
              title: 'Bullet lists',
              href: '/conversion/content-types/structures-and-media/bullet-lists',
              disabled: true,
            },
            {
              title: 'Ordered lists',
              href: '/conversion/content-types/structures-and-media/ordered-lists',
              disabled: true,
            },
            {
              title: 'Nested & task lists',
              href: '/conversion/content-types/structures-and-media/nested-task-lists',
              disabled: true,
            },
            {
              title: 'Basic tables',
              href: '/conversion/content-types/structures-and-media/basic-tables',
              disabled: true,
            },
            {
              title: 'Merged cells',
              href: '/conversion/content-types/structures-and-media/merged-cells',
              disabled: true,
            },
            {
              title: 'Table styling & borders',
              href: '/conversion/content-types/structures-and-media/table-styling-borders',
              disabled: true,
            },
            {
              title: 'Table header rows',
              href: '/conversion/content-types/structures-and-media/table-header-rows',
              disabled: true,
            },
            {
              title: 'Images',
              href: '/conversion/content-types/structures-and-media/images',
              disabled: true,
            },
            {
              title: 'Hyperlinks & bookmarks',
              href: '/conversion/content-types/structures-and-media/hyperlinks-bookmarks',
              disabled: true,
            },
            {
              title: 'Blockquotes & code blocks',
              href: '/conversion/content-types/structures-and-media/blockquotes-code-blocks',
              disabled: true,
            },
            {
              title: 'Horizontal rules',
              href: '/conversion/content-types/structures-and-media/horizontal-rules',
              disabled: true,
            },
          ],
        },
        {
          title: 'Page Layout',
          href: '/conversion/content-types/page-layout/headers-footers',
          disabled: true,
          children: [
            {
              title: 'Headers & footers',
              href: '/conversion/content-types/page-layout/headers-footers',
              disabled: true,
            },
            {
              title: 'Page breaks & sections',
              href: '/conversion/content-types/page-layout/page-breaks-sections',
              disabled: true,
            },
            {
              title: 'Page size & margins',
              href: '/conversion/content-types/page-layout/page-size-margins',
              disabled: true,
            },
            {
              title: 'Page numbers',
              href: '/conversion/content-types/page-layout/page-numbers',
              disabled: true,
            },
          ],
        },
        {
          title: 'Specialized Content',
          href: '/conversion/content-types/specialized-content/math-equations',
          disabled: true,
          children: [
            {
              title: 'Math & equations',
              href: '/conversion/content-types/specialized-content/math-equations',
              disabled: true,
            },
            {
              title: 'Footnotes & endnotes',
              href: '/conversion/content-types/specialized-content/footnotes-endnotes',
              disabled: true,
            },
            {
              title: 'Word styles',
              href: '/conversion/content-types/specialized-content/word-styles',
              disabled: true,
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/import',
      title: 'Extension reference',
      children: [
        {
          title: 'Import',
          href: '/conversion/import/docx/editor-import',
          children: [
            {
              title: 'DOCX',
              href: '/conversion/import/docx/editor-import',
              beta: true,
              children: [
                {
                  title: 'Setup & configuration',
                  href: '/conversion/import/docx/editor-import',
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
          title: 'Export',
          href: '/conversion/export/docx/editor-export',
          children: [
            {
              title: 'DOCX',
              href: '/conversion/export/docx/editor-export',
              beta: true,
              children: [
                {
                  title: 'Setup & configuration',
                  href: '/conversion/export/docx/editor-export',
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
                  title: 'Setup & configuration',
                  href: '/conversion/export/pdf/editor-export',
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
                  title: 'Setup & configuration',
                  href: '/conversion/export/odt/editor-export',
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
                  title: 'Setup & configuration',
                  href: '/conversion/export/epub/editor-export',
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
                  title: 'Setup & configuration',
                  href: '/conversion/export/doc/editor-export',
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
                  title: 'Setup & configuration',
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
      ],
    },
    {
      type: 'group',
      href: '/conversion/getting-started/guides',
      title: 'Guides',
      tags: ['New'],
      children: [
        {
          title: 'Building custom extensions',
          href: '/conversion/getting-started/guides/custom-extensions',
          disabled: true,
        },
        {
          title: 'Debugging & inspecting output',
          href: '/conversion/getting-started/guides/debugging',
          disabled: true,
        },
        {
          title: 'End-to-end walkthrough',
          href: '/conversion/getting-started/guides/end-to-end-walkthrough',
          disabled: true,
        },
      ],
    },
  ],
}
