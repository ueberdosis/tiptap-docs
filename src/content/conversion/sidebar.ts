import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'conversion',
  rootHref: '/conversion/getting-started/overview',
  title: 'Conversion',
  items: [
    {
      type: 'group',
      href: '/conversion/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/conversion/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/conversion/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/import',
      title: 'Usage',
      children: [
        {
          title: 'Import',
          href: '/conversion/usage/import',
        },
        {
          title: 'Export',
          href: '/conversion/usage/export',
        },
        {
          title: 'REST API',
          href: '/conversion/usage/rest-api',
        },
      ],
    },
    {
      type: 'group',
      href: '/conversion/export',
      title: 'Advanced use cases',
      children: [
        {
          title: 'Export custom nodes',
          href: '/conversion/getting-started/rest-api',
        },
        {
          title: 'Override exported styles',
          href: '/conversion/getting-started/rest-api',
        },
        {
          title: 'Handle images',
          href: '/conversion/getting-started/rest-api',
        },
      ],
    },
  ],
}
