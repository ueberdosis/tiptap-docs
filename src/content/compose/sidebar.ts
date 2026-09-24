import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'compose',
  title: 'Compose',
  rootHref: '/compose/getting-started/overview',
  items: [
    {
      type: 'group',
      title: 'Slots',
      href: '/compose/slots',
      children: [
        { title: 'Overview', href: '/compose/getting-started/overview' },
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
            {
              title: 'Build a field sidebar',
              href: '/compose/slots/guides/field-sidebar',
            },
          ],
        },
        {
          title: 'API reference',
          href: '/compose/slots/api-reference',
          children: [
            {
              title: 'Extension, commands and validation',
              href: '/compose/slots/api-reference',
            },
            { title: 'Content and validation rules', href: '/compose/slots/concepts' },
            { title: 'Rendering and NodeViews', href: '/compose/slots/rendering' },
            { title: 'Editor events', href: '/compose/slots/events' },
          ],
        },
      ],
    },
  ],
}
