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
          children: [
            {
              title: 'Generic export',
              href: '/conversion/usage/export',
            },
            {
              title: 'Custom docx',
              href: '/conversion/usage/export/custom-docx',
            },
          ],
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
          title: 'Handle images',
          href: '/conversion/advanced/handle-images',
        },
        {
          title: 'Docx conversion',
          href: '/conversion/advanced/convert-docx',
        },
        {
          title: 'Export custom nodes',
          href: '/conversion/advanced/export-custom-nodes',
        },
        {
          title: 'Override exported styles',
          href: '/conversion/advanced/override-styles',
        },
      ],
    },
  ],
}
