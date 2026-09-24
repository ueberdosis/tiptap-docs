import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'content-protection',
  title: 'Content Protection',
  rootHref: '/content-protection/getting-started/overview',
  items: [
    {
      type: 'group',
      title: 'Get started',
      href: '/content-protection/getting-started',
      children: [{ title: 'Overview', href: '/content-protection/getting-started/overview' }],
    },
    {
      type: 'group',
      title: 'Examples',
      href: '/content-protection/examples',
      children: [
        { title: 'Example policies', href: '/content-protection/examples/example-policies' },
      ],
    },
    {
      type: 'group',
      title: 'API reference',
      href: '/content-protection/api-reference',
      children: [
        {
          title: 'Extension',
          href: '/content-protection/api-reference/extension',
        },
        { title: 'Commands', href: '/content-protection/api-reference/commands' },
        { title: 'Utilities', href: '/content-protection/api-reference/utilities' },
        { title: 'Types', href: '/content-protection/api-reference/types' },
        { title: 'Policy language', href: '/content-protection/api-reference/policy' },
        { title: 'Redacted content', href: '/content-protection/api-reference/rendering' },
      ],
    },
  ],
}
