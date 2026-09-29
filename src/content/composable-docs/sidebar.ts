import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'composable-docs',
  title: 'Composable Docs',
  rootHref: '/composable-docs/slots/getting-started/overview',
  items: [
    {
      type: 'group',
      title: 'Slots',
      href: '/composable-docs/slots',
      children: [
        { title: 'Overview', href: '/composable-docs/slots/getting-started/overview' },
        {
          title: 'Guides',
          href: '/composable-docs/slots/guides/add-slots',
          children: [
            {
              title: 'Add slots to a document',
              href: '/composable-docs/slots/guides/add-slots',
            },
            { title: 'Allow filling only', href: '/composable-docs/slots/guides/fill-only' },
            {
              title: 'Validate a submission',
              href: '/composable-docs/slots/guides/validate-submission',
            },
          ],
        },
        {
          title: 'Examples',
          href: '/composable-docs/slots/examples/table-fields',
          children: [
            { title: 'Table fields example', href: '/composable-docs/slots/examples/table-fields' },
          ],
        },
        {
          title: 'API reference',
          href: '/composable-docs/slots/api-reference/extension',
          children: [
            {
              title: 'Extension',
              href: '/composable-docs/slots/api-reference/extension',
            },
            { title: 'Commands', href: '/composable-docs/slots/api-reference/commands' },
            { title: 'Validation', href: '/composable-docs/slots/api-reference/validation' },
            { title: 'Utilities', href: '/composable-docs/slots/api-reference/utilities' },
            { title: 'Types', href: '/composable-docs/slots/api-reference/types' },
            { title: 'Configuration', href: '/composable-docs/slots/api-reference/concepts' },
            {
              title: 'Rendering and NodeViews',
              href: '/composable-docs/slots/api-reference/rendering',
            },
            { title: 'Editor events', href: '/composable-docs/slots/api-reference/events' },
          ],
        },
      ],
    },
    {
      type: 'group',
      title: 'Content Protection',
      href: '/composable-docs/content-protection',
      children: [
        { title: 'Overview', href: '/composable-docs/content-protection/getting-started/overview' },
        {
          title: 'Example Policies',
          href: '/composable-docs/content-protection/examples/example-policies',
        },
        {
          title: 'API reference',
          href: '/composable-docs/content-protection/api-reference/extension',
          children: [
            {
              title: 'Extension',
              href: '/composable-docs/content-protection/api-reference/extension',
            },
            {
              title: 'Commands',
              href: '/composable-docs/content-protection/api-reference/commands',
            },
            {
              title: 'Utilities',
              href: '/composable-docs/content-protection/api-reference/utilities',
            },
            { title: 'Types', href: '/composable-docs/content-protection/api-reference/types' },
            {
              title: 'Policy language',
              href: '/composable-docs/content-protection/api-reference/policy',
            },
            {
              title: 'Redacted content',
              href: '/composable-docs/content-protection/api-reference/rendering',
            },
          ],
        },
      ],
    },
  ],
}
