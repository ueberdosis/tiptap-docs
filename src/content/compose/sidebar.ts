import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'compose',
  title: 'Compose',
  rootHref: '/compose/slots/getting-started/overview',
  items: [
    {
      type: 'group',
      title: 'Slots',
      href: '/compose/slots',
      children: [
        { title: 'Overview', href: '/compose/slots/getting-started/overview' },
        {
          title: 'Guides',
          href: '/compose/slots/guides/create-fields',
          children: [
            {
              title: 'Create document fields',
              href: '/compose/slots/guides/create-fields',
            },
            {
              title: 'Validate a submission',
              href: '/compose/slots/guides/validate-submission',
            },
            { title: 'Allow filling only', href: '/compose/slots/guides/fill-only' },
          ],
        },
        {
          title: 'API reference',
          href: '/compose/slots/api-reference/extension',
          children: [
            {
              title: 'Extension',
              href: '/compose/slots/api-reference/extension',
            },
            { title: 'Commands', href: '/compose/slots/api-reference/commands' },
            { title: 'Validation', href: '/compose/slots/api-reference/validation' },
            { title: 'Utilities', href: '/compose/slots/api-reference/utilities' },
            { title: 'Types', href: '/compose/slots/api-reference/types' },
            { title: 'Configuration', href: '/compose/slots/concepts' },
            { title: 'Rendering and NodeViews', href: '/compose/slots/rendering' },
            { title: 'Editor events', href: '/compose/slots/events' },
          ],
        },
      ],
    },
  ],
}
