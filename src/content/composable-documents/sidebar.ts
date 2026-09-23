import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'composable-documents',
  title: 'Composable Documents',
  rootHref: '/composable-documents/getting-started/overview',
  items: [
    {
      type: 'group',
      title: 'Get started',
      href: '/composable-documents/getting-started',
      children: [{ title: 'Overview', href: '/composable-documents/getting-started/overview' }],
    },
    {
      type: 'group',
      title: 'Slots · Guides',
      href: '/composable-documents/slots/guides',
      children: [
        {
          title: 'Create document fields',
          href: '/composable-documents/slots/guides/create-fields',
        },
        {
          title: 'Validate a submission',
          href: '/composable-documents/slots/guides/validate-submission',
        },
        { title: 'Allow filling only', href: '/composable-documents/slots/guides/fill-only' },
        {
          title: 'Build a field sidebar',
          href: '/composable-documents/slots/guides/field-sidebar',
        },
      ],
    },
    {
      type: 'group',
      title: 'Slots · API reference',
      href: '/composable-documents/slots',
      children: [
        {
          title: 'Extension, commands and validation',
          href: '/composable-documents/slots/api-reference',
        },
        { title: 'Content and validation rules', href: '/composable-documents/slots/concepts' },
        { title: 'Rendering and NodeViews', href: '/composable-documents/slots/rendering' },
        { title: 'Editor events', href: '/composable-documents/slots/events' },
      ],
    },
  ],
}
