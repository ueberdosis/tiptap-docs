import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'conversion',
  rootHref: '/conversion/getting-started/overview',
  title: 'Conversion',
  items: [
    {
      type: 'group',
      href: '/conversion/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/conversion/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/conversion/getting-started/install',
          children: [
            {
              title: 'DOCX',
              href: '/conversion/install/docx/import',
              children: [
                {
                  title: 'Import extension',
                  href: '/conversion/install/docx/import',
                },
                {
                  title: 'Import REST API',
                  href: '/conversion/install/docx/import-rest-api',
                },
                {
                  title: 'Export extension',
                  href: '/conversion/install/docx/export',
                },
                {
                  title: 'Export REST API',
                  href: '/conversion/install/docx/export-rest-api',
                },
              ],
            },
            {
              title: 'PDF',
              href: '/conversion/install/pdf/export',
              children: [
                {
                  title: 'Export extension',
                  href: '/conversion/install/pdf/export',
                },
                {
                  title: 'Export REST API',
                  href: '/conversion/install/pdf/export-rest-api',
                },
              ],
            },
            {
              title: 'Markdown',
              href: '/conversion/install/markdown/import-rest-api',
              children: [
                {
                  title: 'Import REST API',
                  href: '/conversion/install/markdown/import-rest-api',
                },
                {
                  title: 'Export extension',
                  href: '/conversion/install/markdown/export',
                },
                {
                  title: 'Export REST API',
                  href: '/conversion/install/markdown/export-rest-api',
                },
              ],
            },
            {
              title: 'ODT',
              href: '/conversion/install/odt/export',
              children: [
                {
                  title: 'Export extension',
                  href: '/conversion/install/odt/export',
                },
                {
                  title: 'Export REST API',
                  href: '/conversion/install/odt/export-rest-api',
                },
              ],
            },
            {
              title: 'EPUB',
              href: '/conversion/install/epub/export',
              children: [
                {
                  title: 'Export extension',
                  href: '/conversion/install/epub/export',
                },
                {
                  title: 'Export REST API',
                  href: '/conversion/install/epub/export-rest-api',
                },
              ],
            },
            {
              title: 'DOC',
              href: '/conversion/install/doc/export',
              children: [
                {
                  title: 'Export extension',
                  href: '/conversion/install/doc/export',
                },
                {
                  title: 'Export REST API',
                  href: '/conversion/install/doc/export-rest-api',
                },
              ],
            },
          ],
        },
        {
          title: 'Supported features',
          href: '/conversion/getting-started/feature-support-matrix',
          tags: ['New'],
          disabled: true,
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
          title: 'Text and formatting',
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
              title: 'Subscript and superscript',
              href: '/conversion/content-types/text-and-formatting/subscript-superscript',
              disabled: true,
            },
            {
              title: 'Text color and highlight',
              href: '/conversion/content-types/text-and-formatting/text-color-highlight',
              disabled: true,
            },
            {
              title: 'Font family and size',
              href: '/conversion/content-types/text-and-formatting/font-family-size',
              disabled: true,
            },
          ],
        },
        {
          title: 'Structures and media',
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
              title: 'Nested and task lists',
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
              title: 'Table styling and borders',
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
              title: 'Hyperlinks and bookmarks',
              href: '/conversion/content-types/structures-and-media/hyperlinks-bookmarks',
              disabled: true,
            },
            {
              title: 'Blockquotes and code blocks',
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
          title: 'Page layout',
          href: '/conversion/content-types/page-layout/headers-footers',
          disabled: true,
          children: [
            {
              title: 'Headers and footers',
              href: '/conversion/content-types/page-layout/headers-footers',
              disabled: true,
            },
            {
              title: 'Page breaks and sections',
              href: '/conversion/content-types/page-layout/page-breaks-sections',
              disabled: true,
            },
            {
              title: 'Page size and margins',
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
          title: 'Specialized content',
          href: '/conversion/content-types/specialized-content/math-equations',
          disabled: true,
          children: [
            {
              title: 'Math and equations',
              href: '/conversion/content-types/specialized-content/math-equations',
              disabled: true,
            },
            {
              title: 'Footnotes and endnotes',
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
          title: 'Debugging and inspecting output',
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
