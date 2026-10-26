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
        { title: 'React', href: '/page-layout/getting-started/react' },
        {
          title: 'An editor you already have',
          href: '/page-layout/getting-started/existing-editor',
        },
        {
          title: 'Positions and events',
          href: '/page-layout/getting-started/positions-and-events',
        },
        {
          title: 'Migrate from Pages 1',
          href: '/page-layout/getting-started/migrate-from-pages-1',
        },
        { title: 'Toolbar', href: '/page-layout/getting-started/toolbar' },
        { title: 'Components', href: '/page-layout/getting-started/components' },
        {
          title: 'Features',
          href: '',
          children: [
            { title: 'Page format', href: '/page-layout/features/page-format' },
            { title: 'Sections', href: '/page-layout/features/sections' },
            { title: 'Breaks', href: '/page-layout/features/breaks' },
            { title: 'Section columns', href: '/page-layout/features/section-columns' },
            { title: 'Header and footer', href: '/page-layout/features/header-and-footer' },
            { title: 'Page numbers', href: '/page-layout/features/page-numbers' },
            { title: 'Page colors', href: '/page-layout/features/page-colors' },
            { title: 'Zoom', href: '/page-layout/features/zoom' },
            { title: 'Styling', href: '/page-layout/features/styling' },
          ],
        },
        {
          title: 'Other extensions on pages',
          href: '/page-layout/other-extensions/overview',
          children: [
            { title: 'Tables', href: '/page-layout/other-extensions/tables' },
            { title: 'Footnotes', href: '/page-layout/other-extensions/footnotes' },
            { title: 'Cross-references', href: '/page-layout/other-extensions/cross-references' },
            { title: 'Document Styles', href: '/page-layout/other-extensions/document-styles' },
            { title: 'Outline numbering', href: '/page-layout/other-extensions/outline-numbering' },
            { title: 'Column layout', href: '/page-layout/other-extensions/column-layout' },
            { title: 'Bookmarks', href: '/page-layout/other-extensions/bookmarks' },
            { title: 'Number formats', href: '/page-layout/other-extensions/number-formats' },
            { title: 'Whole blocks', href: '/page-layout/other-extensions/whole-blocks' },
            {
              title: 'Your own extension',
              href: '/page-layout/other-extensions/your-own-extension',
            },
          ],
        },
        {
          title: 'Guides',
          href: '',
          children: [
            { title: 'Collaboration', href: '/page-layout/guides/collaboration' },
            { title: 'Long documents', href: '/page-layout/guides/long-documents' },
            { title: 'Printing and PDF', href: '/page-layout/guides/printing-and-pdf' },
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
            { title: 'Limitations', href: '/page-layout/reference/limitations' },
          ],
        },
      ],
    },
  ],
}
