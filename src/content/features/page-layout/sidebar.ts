import type { SidebarConfig } from '@/types'

// The extensions' own pages are under /features/<name>, each from its own package; this
// section has what Page Layout does with them on pages.
export const sidebarConfig: SidebarConfig = {
  id: 'page-layout',
  rootHref: '/features/page-layout/getting-started/overview',
  title: 'Page Layout',
  items: [
    {
      type: 'group',
      href: '/features/page-layout/getting-started/overview',
      title: 'Page Layout',
      tags: ['Alpha'],
      children: [
        { title: 'Overview', href: '/features/page-layout/getting-started/overview' },
        {
          title: 'Install',
          href: '/features/page-layout/getting-started/install',
          children: [
            { title: 'React', href: '/features/page-layout/getting-started/install/react' },
            {
              title: 'Existing editor',
              href: '/features/page-layout/getting-started/install/existing-editor',
            },
          ],
        },
        {
          title: 'Document and pages',
          href: '/features/page-layout/getting-started/document-and-pages',
          children: [
            {
              title: 'Reading the pages',
              href: '/features/page-layout/getting-started/document-and-pages/reading',
            },
            {
              title: 'Writing to the document',
              href: '/features/page-layout/getting-started/document-and-pages/writing',
            },
          ],
        },
        {
          title: 'Migrate from Pages',
          href: '/features/page-layout/getting-started/migrate-from-pages',
        },
        {
          title: 'Features',
          href: '',
          children: [
            { title: 'Page format', href: '/features/page-layout/page-format' },
            { title: 'Sections', href: '/features/page-layout/sections' },
            { title: 'Breaks', href: '/features/page-layout/breaks' },
            { title: 'Section columns', href: '/features/page-layout/section-columns' },
            { title: 'Header and footer', href: '/features/page-layout/header-and-footer' },
            {
              title: 'Page numbers',
              href: '/features/page-layout/page-numbers',
              children: [
                {
                  title: 'Numbering per section',
                  href: '/features/page-layout/page-numbers/numbering',
                },
                {
                  title: 'Chapter numbers',
                  href: '/features/page-layout/page-numbers/chapter-numbers',
                },
              ],
            },
            { title: 'Page colors', href: '/features/page-layout/page-colors' },
            { title: 'Zoom', href: '/features/page-layout/zoom' },
            { title: 'Printing', href: '/features/page-layout/printing' },
          ],
        },
        {
          title: 'Extension behavior',
          href: '/features/page-layout/extension-behavior',
          children: [
            { title: 'Tables', href: '/features/page-layout/extension-behavior/tables' },
            { title: 'Lists', href: '/features/page-layout/extension-behavior/lists' },
            { title: 'Footnotes', href: '/features/page-layout/extension-behavior/footnotes' },
            {
              title: 'Cross-references',
              href: '/features/page-layout/extension-behavior/cross-references',
            },
            {
              title: 'Document styles',
              href: '/features/page-layout/extension-behavior/document-styles',
            },
            {
              title: 'Outline numbering',
              href: '/features/page-layout/extension-behavior/outline-numbering',
            },
            { title: 'Columns', href: '/features/page-layout/extension-behavior/columns' },
            {
              title: 'Your own extension',
              href: '/features/page-layout/extension-behavior/your-own-extension',
              children: [
                {
                  title: 'Layout rules',
                  href: '/features/page-layout/extension-behavior/your-own-extension/layout-rules',
                },
                {
                  title: 'When no rule fits',
                  href: '/features/page-layout/extension-behavior/your-own-extension/when-no-rule-fits',
                },
                {
                  title: 'NodeLayout reference',
                  href: '/features/page-layout/extension-behavior/your-own-extension/node-layout-reference',
                },
                {
                  title: 'React NodeViews',
                  href: '/features/page-layout/extension-behavior/your-own-extension/react-nodeviews',
                },
              ],
            },
          ],
        },
        {
          title: 'Guides',
          href: '',
          children: [
            { title: 'Styling', href: '/features/page-layout/guides/styling' },
            { title: 'Collaboration', href: '/features/page-layout/guides/collaboration' },
            { title: 'Long documents', href: '/features/page-layout/guides/long-documents' },
            { title: 'On a server', href: '/features/page-layout/guides/on-a-server' },
            { title: 'Word documents', href: '/features/page-layout/guides/word' },
          ],
        },
        {
          title: 'Reference',
          href: '',
          children: [
            { title: 'Options', href: '/features/page-layout/reference/options' },
            { title: 'Commands', href: '/features/page-layout/reference/commands' },
            { title: 'CSS reference', href: '/features/page-layout/reference/css' },
            { title: 'Limitations', href: '/features/page-layout/reference/limitations' },
          ],
        },
      ],
    },
  ],
}
