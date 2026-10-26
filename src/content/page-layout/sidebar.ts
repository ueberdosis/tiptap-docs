import type { SidebarConfig } from '@/types'

// The extensions' own pages are among the editor's extensions, under Document structure
// (src/content/editor/sidebar.ts); this section has what Page Layout does with them on pages.
export const sidebarConfig: SidebarConfig = {
  id: 'page-layout',
  rootHref: '/page-layout/getting-started/overview',
  title: 'Page Layout',
  items: [
    {
      type: 'group',
      href: '/page-layout/getting-started/overview',
      title: 'Page Layout',
      tags: ['Alpha'],
      children: [
        { title: 'Overview', href: '/page-layout/getting-started/overview' },
        { title: 'Install', href: '/page-layout/getting-started/install' },
        { title: 'Existing editor', href: '/page-layout/getting-started/existing-editor' },
        {
          title: 'Document and pages',
          href: '/page-layout/getting-started/document-and-pages',
          children: [
            {
              title: 'Reading the pages',
              href: '/page-layout/getting-started/document-and-pages/reading',
            },
            {
              title: 'Writing to the document',
              href: '/page-layout/getting-started/document-and-pages/writing',
            },
          ],
        },
        {
          title: 'Migrate from Pages 1',
          href: '/page-layout/getting-started/migrate-from-pages-1',
        },
        {
          title: 'Features',
          href: '',
          children: [
            { title: 'Page format', href: '/page-layout/features/page-format' },
            { title: 'Sections', href: '/page-layout/features/sections' },
            { title: 'Breaks', href: '/page-layout/features/breaks' },
            { title: 'Section columns', href: '/page-layout/features/section-columns' },
            { title: 'Header and footer', href: '/page-layout/features/header-and-footer' },
            {
              title: 'Page numbers',
              href: '/page-layout/features/page-numbers',
              children: [
                {
                  title: 'Numbering per section',
                  href: '/page-layout/features/page-numbers/numbering',
                },
                {
                  title: 'Chapter numbers',
                  href: '/page-layout/features/page-numbers/chapter-numbers',
                },
              ],
            },
            { title: 'Page colors', href: '/page-layout/features/page-colors' },
            { title: 'Zoom', href: '/page-layout/features/zoom' },
            { title: 'Printing', href: '/page-layout/features/printing' },
          ],
        },
        {
          title: 'Paginating extensions',
          href: '/page-layout/paginating-extensions',
          children: [
            { title: 'Tables', href: '/page-layout/paginating-extensions/tables' },
            { title: 'Footnotes', href: '/page-layout/paginating-extensions/footnotes' },
            {
              title: 'Cross-references',
              href: '/page-layout/paginating-extensions/cross-references',
            },
            {
              title: 'Document Styles',
              href: '/page-layout/paginating-extensions/document-styles',
            },
            {
              title: 'Outline numbering',
              href: '/page-layout/paginating-extensions/outline-numbering',
            },
            { title: 'Columns', href: '/page-layout/paginating-extensions/columns' },
            {
              title: 'Your own extension',
              href: '/page-layout/paginating-extensions/your-own-extension',
              children: [
                {
                  title: 'Layout rules',
                  href: '/page-layout/paginating-extensions/your-own-extension/layout-rules',
                },
                {
                  title: 'When no rule fits',
                  href: '/page-layout/paginating-extensions/your-own-extension/when-no-rule-fits',
                },
                {
                  title: 'NodeLayout reference',
                  href: '/page-layout/paginating-extensions/your-own-extension/node-layout-reference',
                },
              ],
            },
          ],
        },
        {
          title: 'Guides',
          href: '',
          children: [
            { title: 'Styling', href: '/page-layout/guides/styling' },
            { title: 'React NodeViews', href: '/page-layout/guides/react-nodeviews' },
            { title: 'Collaboration', href: '/page-layout/guides/collaboration' },
            { title: 'Long documents', href: '/page-layout/guides/long-documents' },
            { title: 'On a server', href: '/page-layout/guides/on-a-server' },
            { title: 'Word documents', href: '/page-layout/guides/word' },
          ],
        },
        {
          title: 'Reference',
          href: '',
          children: [
            { title: 'Options', href: '/page-layout/reference/options' },
            { title: 'Commands', href: '/page-layout/reference/commands' },
            { title: 'CSS reference', href: '/page-layout/reference/css' },
            { title: 'Limitations', href: '/page-layout/reference/limitations' },
          ],
        },
      ],
    },
  ],
}
