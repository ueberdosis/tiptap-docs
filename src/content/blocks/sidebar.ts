import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'blocks',
  title: 'Blocks',
  rootHref: '/blocks/slots/getting-started/overview',
  items: [
    {
      type: 'group',
      title: 'Slots',
      href: '/blocks/slots',
      children: [
        { title: 'Overview', href: '/blocks/slots/getting-started/overview' },
        {
          title: 'Guides',
          href: '/blocks/slots/guides/create-fields',
          children: [
            {
              title: 'Create document fields',
              href: '/blocks/slots/guides/create-fields',
            },
            {
              title: 'Validate a submission',
              href: '/blocks/slots/guides/validate-submission',
            },
            { title: 'Allow filling only', href: '/blocks/slots/guides/fill-only' },
          ],
        },
        {
          title: 'Examples',
          href: '/blocks/slots/examples/table-fields',
          children: [
            { title: 'Table fields example', href: '/blocks/slots/examples/table-fields' },
          ],
        },
        {
          title: 'API reference',
          href: '/blocks/slots/api-reference/extension',
          children: [
            {
              title: 'Extension',
              href: '/blocks/slots/api-reference/extension',
            },
            { title: 'Commands', href: '/blocks/slots/api-reference/commands' },
            { title: 'Validation', href: '/blocks/slots/api-reference/validation' },
            { title: 'Utilities', href: '/blocks/slots/api-reference/utilities' },
            { title: 'Types', href: '/blocks/slots/api-reference/types' },
            { title: 'Configuration', href: '/blocks/slots/concepts' },
            { title: 'Rendering and NodeViews', href: '/blocks/slots/rendering' },
            { title: 'Editor events', href: '/blocks/slots/events' },
          ],
        },
      ],
    },
    {
      type: 'group',
      title: 'Content Protection',
      href: '/blocks/content-protection',
      children: [
        { title: 'Overview', href: '/blocks/content-protection/getting-started/overview' },
        {
          title: 'Example Policies',
          href: '/blocks/content-protection/examples/example-policies',
        },
        {
          title: 'API reference',
          href: '/blocks/content-protection/api-reference/extension',
          children: [
            { title: 'Extension', href: '/blocks/content-protection/api-reference/extension' },
            { title: 'Commands', href: '/blocks/content-protection/api-reference/commands' },
            { title: 'Utilities', href: '/blocks/content-protection/api-reference/utilities' },
            { title: 'Types', href: '/blocks/content-protection/api-reference/types' },
            { title: 'Policy language', href: '/blocks/content-protection/api-reference/policy' },
            {
              title: 'Redacted content',
              href: '/blocks/content-protection/api-reference/rendering',
            },
          ],
        },
      ],
    },
  ],
}
