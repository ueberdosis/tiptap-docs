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
        {
          title: 'Install',
          href: '/page-layout/getting-started/install',
          children: [
            { title: 'React', href: '/page-layout/getting-started/install/react' },
            {
              title: 'Existing editor',
              href: '/page-layout/getting-started/install/existing-editor',
            },
          ],
        },
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
          title: 'Migrate from Pages',
          href: '/page-layout/getting-started/migrate-from-pages',
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
          title: 'Extension behavior',
          href: '/page-layout/extension-behavior',
          children: [
            { title: 'Tables', href: '/page-layout/extension-behavior/tables' },
            { title: 'Lists', href: '/page-layout/extension-behavior/lists' },
            { title: 'Footnotes', href: '/page-layout/extension-behavior/footnotes' },
            {
              title: 'Cross-references',
              href: '/page-layout/extension-behavior/cross-references',
            },
            {
              title: 'Document styles',
              href: '/page-layout/extension-behavior/document-styles',
            },
            {
              title: 'Outline numbering',
              href: '/page-layout/extension-behavior/outline-numbering',
            },
            { title: 'Columns', href: '/page-layout/extension-behavior/columns' },
            {
              title: 'Your own extension',
              href: '/page-layout/extension-behavior/your-own-extension',
              children: [
                {
                  title: 'Layout rules',
                  href: '/page-layout/extension-behavior/your-own-extension/layout-rules',
                },
                {
                  title: 'When no rule fits',
                  href: '/page-layout/extension-behavior/your-own-extension/when-no-rule-fits',
                },
                {
                  title: 'NodeLayout reference',
                  href: '/page-layout/extension-behavior/your-own-extension/node-layout-reference',
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
