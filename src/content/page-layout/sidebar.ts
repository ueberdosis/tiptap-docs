import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'page-layout',
  rootHref: '/page-layout/getting-started/overview',
  title: 'Page Layout',
  items: [
    {
      type: 'group',
      href: '/page-layout/getting-started/overview',
      title: 'Page Layout',
      tags: ['Beta'],
      children: [
        { title: 'Overview', href: '/page-layout/getting-started/overview' },
        { title: 'Install', href: '/page-layout/getting-started/install' },
        { title: 'React', href: '/page-layout/getting-started/react' },
        { title: 'Toolbar', href: '/page-layout/getting-started/toolbar' },
        { title: 'Components', href: '/page-layout/getting-started/components' },
        { title: 'Packages', href: '/page-layout/getting-started/packages' },
        {
          title: 'Core concepts',
          href: '',
          children: [
            { title: 'Page format', href: '/page-layout/core-concepts/page-format' },
            { title: 'Sections', href: '/page-layout/core-concepts/sections' },
            { title: 'Section columns', href: '/page-layout/core-concepts/section-columns' },
            { title: 'Breaks', href: '/page-layout/core-concepts/breaks' },
            { title: 'Header and footer', href: '/page-layout/core-concepts/header-and-footer' },
            { title: 'Page numbers', href: '/page-layout/core-concepts/page-numbers' },
            { title: 'Page colors', href: '/page-layout/core-concepts/page-colors' },
            { title: 'Zoom', href: '/page-layout/core-concepts/zoom' },
            { title: 'Styling', href: '/page-layout/core-concepts/styling' },
            { title: 'Limitations', href: '/page-layout/core-concepts/limitations' },
          ],
        },
        {
          title: 'Extensions',
          href: '/page-layout/extensions/overview',
          children: [
            { title: 'Tables', href: '/page-layout/extensions/tables' },
            { title: 'Columns', href: '/page-layout/extensions/columns' },
            {
              title: 'Footnotes',
              href: '/page-layout/extensions/footnotes',
              children: [{ title: 'On pages', href: '/page-layout/extensions/footnotes/on-pages' }],
            },
            {
              title: 'Outline numbering',
              href: '/page-layout/extensions/outline-numbering',
              children: [
                { title: 'On pages', href: '/page-layout/extensions/outline-numbering/on-pages' },
              ],
            },
            { title: 'Number formats', href: '/page-layout/extensions/number-formats' },
            { title: 'Whole blocks', href: '/page-layout/extensions/whole-blocks' },
            {
              title: 'Cross-references',
              href: '/page-layout/extensions/cross-references',
              children: [
                { title: 'Sources', href: '/page-layout/extensions/cross-references/sources' },
                {
                  title: 'What a reference shows',
                  href: '/page-layout/extensions/cross-references/displays',
                },
                {
                  title: 'Several targets',
                  href: '/page-layout/extensions/cross-references/joins',
                },
                { title: 'Commands', href: '/page-layout/extensions/cross-references/commands' },
                { title: 'Word fields', href: '/page-layout/extensions/cross-references/docx' },
                { title: 'On pages', href: '/page-layout/extensions/cross-references/on-pages' },
              ],
            },
            {
              title: 'Bookmarks',
              href: '/page-layout/extensions/bookmarks',
              children: [{ title: 'Commands', href: '/page-layout/extensions/bookmarks/commands' }],
            },
            {
              title: 'Document Styles',
              href: '/page-layout/extensions/document-styles',
              children: [
                {
                  title: 'Definitions',
                  href: '/page-layout/extensions/document-styles/definitions',
                },
                {
                  title: 'Applying styles',
                  href: '/page-layout/extensions/document-styles/applying',
                },
                {
                  title: 'Colors and fonts',
                  href: '/page-layout/extensions/document-styles/values',
                },
                { title: 'Themes', href: '/page-layout/extensions/document-styles/themes' },
                { title: 'Table styles', href: '/page-layout/extensions/document-styles/tables' },
                { title: 'Libraries', href: '/page-layout/extensions/document-styles/libraries' },
                { title: 'Cleaning up', href: '/page-layout/extensions/document-styles/cleanup' },
                { title: 'At a glance', href: '/page-layout/extensions/document-styles/api' },
                { title: 'On pages', href: '/page-layout/extensions/document-styles/on-pages' },
              ],
            },
          ],
        },
        {
          title: 'Guides',
          href: '',
          children: [
            { title: 'Custom Node types', href: '/page-layout/guides/custom-nodes' },
            { title: 'Collaboration', href: '/page-layout/guides/collaboration' },
            { title: 'Long documents', href: '/page-layout/guides/long-documents' },
            { title: 'Printing and PDF', href: '/page-layout/guides/printing-and-pdf' },
            { title: 'On a server', href: '/page-layout/guides/on-a-server' },
            { title: 'Word documents', href: '/page-layout/guides/word' },
          ],
        },
        {
          title: 'API reference',
          href: '',
          children: [
            { title: 'Options', href: '/page-layout/api/options' },
            { title: 'Commands', href: '/page-layout/api/commands' },
          ],
        },
      ],
    },
  ],
}
