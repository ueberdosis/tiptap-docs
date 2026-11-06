import type { SidebarConfig } from '@/types'

// The pages are synced from @tiptap-pro/extension-document-styles. What Page Layout does with
// the styles on pages is in the Page Layout section.
export const sidebarConfig: SidebarConfig = {
  id: 'document-styles',
  rootHref: '/features/document-styles',
  title: 'Document styles',
  items: [
    {
      type: 'group',
      href: '/features/document-styles',
      title: 'Document styles',
      tags: ['Alpha'],
      children: [
        { title: 'Overview', href: '/features/document-styles' },
        { title: 'Definitions', href: '/features/document-styles/definitions' },
        { title: 'Applying styles', href: '/features/document-styles/applying' },
        { title: 'Table styles', href: '/features/document-styles/tables' },
        { title: 'Themes', href: '/features/document-styles/themes' },
        { title: 'Colors and fonts', href: '/features/document-styles/values' },
        { title: 'Libraries', href: '/features/document-styles/libraries' },
        { title: 'Cleaning up', href: '/features/document-styles/cleanup' },
        { title: 'Everything at a glance', href: '/features/document-styles/api' },
      ],
    },
  ],
}
