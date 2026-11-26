import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'cross-references',
  rootHref: '/features/cross-references',
  title: 'Cross-references',
  items: [
    {
      type: 'group',
      href: '/features/cross-references',
      title: 'Cross-references',
      tags: ['Alpha'],
      children: [
        { title: 'Overview', href: '/features/cross-references' },
        { title: 'Install', href: '/features/cross-references/install' },
        {
          title: 'Features',
          href: '',
          children: [
            { title: 'Targets', href: '/features/cross-references/targets' },
            { title: 'References', href: '/features/cross-references/references' },
            { title: 'What a reference shows', href: '/features/cross-references/displays' },
            { title: 'Several targets', href: '/features/cross-references/joins' },
            { title: 'Sources', href: '/features/cross-references/sources' },
            { title: 'Styling', href: '/features/cross-references/styling' },
          ],
        },
        {
          title: 'Guides',
          href: '',
          children: [
            { title: 'Build a reference picker', href: '/features/cross-references/picker' },
            { title: 'Word fields', href: '/features/cross-references/docx' },
            { title: 'Reading the document', href: '/features/cross-references/reading' },
          ],
        },
        {
          title: 'Reference',
          href: '',
          children: [
            { title: 'Options', href: '/features/cross-references/options' },
            { title: 'Commands', href: '/features/cross-references/commands' },
            { title: 'Limitations', href: '/features/cross-references/limitations' },
          ],
        },
      ],
    },
  ],
}
