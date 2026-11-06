import type { SidebarConfig } from '@/types'

// The pages are synced from @tiptap-pro/extension-outline-numbering. What Page Layout does with
// the numbers on pages is in the Page Layout section.
export const sidebarConfig: SidebarConfig = {
  id: 'outline-numbering',
  rootHref: '/features/outline-numbering',
  title: 'Outline numbering',
  items: [
    {
      type: 'group',
      href: '/features/outline-numbering',
      title: 'Outline numbering',
      tags: ['Alpha'],
      children: [
        { title: 'Overview', href: '/features/outline-numbering' },
        { title: 'Install', href: '/features/outline-numbering/install' },
        { title: 'Levels and templates', href: '/features/outline-numbering/levels' },
        { title: 'Lists as clauses', href: '/features/outline-numbering/clauses' },
        { title: 'Stored scheme', href: '/features/outline-numbering/scheme' },
        { title: 'What is numbered', href: '/features/outline-numbering/what-is-numbered' },
        { title: 'Numbers in the editor', href: '/features/outline-numbering/display' },
        { title: 'Reading the numbers', href: '/features/outline-numbering/reading' },
        { title: 'Options', href: '/features/outline-numbering/options' },
        { title: 'Commands', href: '/features/outline-numbering/commands' },
        { title: 'Limitations', href: '/features/outline-numbering/limitations' },
      ],
    },
  ],
}
