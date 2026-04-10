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
          title: 'Live demo',
          href: '/conversion/getting-started/demo',
        },
        {
          title: 'Supported features',
          href: '/conversion/getting-started/feature-support-matrix',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/import',
      title: 'Import',
      children: [
        {
          title: 'DOCX',
          href: '/conversion/import/docx/editor-extension',
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/import/docx/editor-extension',
            },
            {
              title: 'REST API',
              href: '/conversion/import/docx/rest-api',
            },
            {
              title: 'ConvertKit',
              href: '/conversion/import/docx/convert-kit',
            },
            {
              title: 'Customize',
              href: '/conversion/import/docx/custom-node-mapping',
              children: [
                {
                  title: 'Node mapping',
                  href: '/conversion/import/docx/custom-node-mapping',
                },
                {
                  title: 'Mark mapping',
                  href: '/conversion/import/docx/custom-mark-mapping',
                },
                {
                  title: 'Image handling',
                  href: '/conversion/import/docx/image-handling',
                },
                {
                  title: 'Page breaks',
                  href: '/conversion/import/docx/page-breaks',
                },
              ],
            },
          ],
        },
        {
          title: 'Markdown',
          href: '/conversion/import/markdown/rest-api',
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
      children: [
        {
          title: 'DOCX',
          href: '/conversion/export/docx/editor-extension',
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/docx/editor-extension',
            },
            {
              title: 'REST API',
              href: '/conversion/export/docx/rest-api',
            },
            {
              title: 'Customize',
              href: '/conversion/export/docx/custom-nodes',
              children: [
                {
                  title: 'Custom nodes',
                  href: '/conversion/export/docx/custom-nodes',
                },
                {
                  title: 'Styles',
                  href: '/conversion/export/docx/styles',
                },
                {
                  title: 'Headers & footers',
                  href: '/conversion/export/docx/headers-footers',
                },
                {
                  title: 'Page breaks',
                  href: '/conversion/export/docx/page-breaks',
                },
                {
                  title: 'Page layout',
                  href: '/conversion/export/docx/page-layout',
                },
              ],
            },
          ],
        },
        {
          title: 'PDF',
          href: '/conversion/export/pdf/editor-extension',
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/pdf/editor-extension',
            },
            {
              title: 'REST API',
              href: '/conversion/export/pdf/rest-api',
            },
          ],
        },
        {
          title: 'ODT',
          href: '/conversion/export/odt/editor-extension',
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/odt/editor-extension',
            },
            {
              title: 'REST API',
              href: '/conversion/export/odt/rest-api',
            },
          ],
        },
        {
          title: 'EPUB',
          href: '/conversion/export/epub/editor-extension',
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/epub/editor-extension',
            },
            {
              title: 'REST API',
              href: '/conversion/export/epub/rest-api',
            },
          ],
        },
        {
          title: 'DOC',
          href: '/conversion/export/doc/editor-extension',
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/doc/editor-extension',
            },
            {
              title: 'REST API',
              href: '/conversion/export/doc/rest-api',
            },
          ],
        },
        {
          title: 'Markdown',
          href: '/conversion/export/markdown/editor-extension',
          children: [
            {
              title: 'Editor extension',
              href: '/conversion/export/markdown/editor-extension',
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
      href: '/conversion/content-types/overview',
      title: 'Content reference',
      children: [
        {
          title: 'Overview',
          href: '/conversion/content-types/overview',
        },
        {
          title: 'Text and formatting',
          href: '/conversion/content-types/text-and-formatting/paragraphs',
          children: [
            {
              title: 'Paragraphs',
              href: '/conversion/content-types/text-and-formatting/paragraphs',
            },
            {
              title: 'Headings',
              href: '/conversion/content-types/text-and-formatting/headings',
            },
            {
              title: 'Text alignment',
              href: '/conversion/content-types/text-and-formatting/text-alignment',
            },
            {
              title: 'Bold, italic, underline, strike',
              href: '/conversion/content-types/text-and-formatting/bold-italic-underline-strike',
            },
            {
              title: 'Subscript and superscript',
              href: '/conversion/content-types/text-and-formatting/subscript-superscript',
            },
            {
              title: 'Text color and highlight',
              href: '/conversion/content-types/text-and-formatting/text-color-highlight',
            },
            {
              title: 'Font family and size',
              href: '/conversion/content-types/text-and-formatting/font-family-size',
            },
            {
              title: 'Lists',
              href: '/conversion/content-types/text-and-formatting/lists',
            },
            {
              title: 'Tabs',
              href: '/conversion/content-types/text-and-formatting/tabs',
            },
          ],
        },
        {
          title: 'Structures and media',
          href: '/conversion/content-types/structures-and-media/tables',
          children: [
            {
              title: 'Tables',
              href: '/conversion/content-types/structures-and-media/tables',
            },
            {
              title: 'Images',
              href: '/conversion/content-types/structures-and-media/images',
            },
            {
              title: 'Hyperlinks and bookmarks',
              href: '/conversion/content-types/structures-and-media/hyperlinks-bookmarks',
            },
            {
              title: 'Block elements',
              href: '/conversion/content-types/structures-and-media/block-elements',
            },
            {
              title: 'Math and equations',
              href: '/conversion/content-types/structures-and-media/math-equations',
            },
            {
              title: 'Footnotes and endnotes',
              href: '/conversion/content-types/structures-and-media/footnotes-endnotes',
            },
            {
              title: 'Word styles',
              href: '/conversion/content-types/structures-and-media/word-styles',
            },
          ],
        },
        {
          title: 'Page layout',
          href: '/conversion/content-types/page-layout/headers-footers',
          children: [
            {
              title: 'Headers and footers',
              href: '/conversion/content-types/page-layout/headers-footers',
            },
            {
              title: 'Page breaks',
              href: '/conversion/content-types/page-layout/page-breaks',
            },
            {
              title: 'Page structure',
              href: '/conversion/content-types/page-layout/page-structure',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/getting-started/guides',
      title: 'Guides',
      children: [
        {
          title: 'Styling converted content',
          href: '/conversion/getting-started/guides/styling-converted-content',
        },
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
