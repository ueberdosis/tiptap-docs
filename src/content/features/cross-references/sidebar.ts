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
        { title: 'What a reference shows', href: '/features/cross-references/displays' },
        { title: 'Several targets', href: '/features/cross-references/joins' },
        { title: 'Sources', href: '/features/cross-references/sources' },
        { title: 'Word fields', href: '/features/cross-references/docx' },
      ],
    },
  ],
}
