import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'compare',
  rootHref: '/compare/getting-started/overview',
  title: 'Compare',
  items: [
    {
      type: 'group',
      href: '/compare/getting-started',
      title: 'Get started',
      children: [{ title: 'Overview', href: '/compare/getting-started/overview' }],
    },
    {
      type: 'group',
      href: '/compare/guides',
      title: 'Guides',
      children: [
        { title: 'Compare documents', href: '/compare/guides/compare-documents' },
        { title: 'Compare versions', href: '/compare/guides/compare-versions' },
      ],
    },
    {
      type: 'group',
      href: '/compare/api-reference',
      title: 'API reference',
      children: [
        { title: 'Commands', href: '/compare/api-reference/commands' },
        { title: 'Utilities', href: '/compare/api-reference/utilities' },
        { title: 'Types', href: '/compare/api-reference/types' },
        { title: 'Styling', href: '/compare/api-reference/styling' },
      ],
    },
  ],
}
