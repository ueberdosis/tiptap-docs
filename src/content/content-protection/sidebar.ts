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
      title: 'Guides',
      href: '/content-protection/guides',
      children: [
        { title: 'Protect a template', href: '/content-protection/guides/protect-template' },
        { title: 'Change permissions', href: '/content-protection/guides/change-permissions' },
        { title: 'Protect table structure', href: '/content-protection/guides/protect-tables' },
        { title: 'Customize hidden content', href: '/content-protection/guides/custom-redaction' },
      ],
    },
    {
      type: 'group',
      title: 'API reference',
      href: '/content-protection/api-reference',
      children: [
        {
          title: 'Extension, commands and utilities',
          href: '/content-protection/api-reference/extension',
        },
        { title: 'Policy language', href: '/content-protection/api-reference/policy' },
        { title: 'Redaction rendering', href: '/content-protection/api-reference/rendering' },
      ],
    },
  ],
}
