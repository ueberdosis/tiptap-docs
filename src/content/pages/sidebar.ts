import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'pages',
  rootHref: '/pages/getting-started/overview',
  title: 'Pages',
  items: [
    {
      type: 'group',
      href: '/pages/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/pages/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/pages/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/core-concepts',
      title: 'Core concepts',
      children: [
        {
          title: 'Options',
          href: '/pages/core-concepts/options',
        },
        {
          title: 'Headers & Footers',
          href: '/pages/core-concepts/headers-footers',
        },
        {
          title: 'Page format',
          href: '/pages/core-concepts/page-format',
        },
        {
          title: 'Page layout',
          href: '/pages/core-concepts/page-layout',
        },
        {
          title: 'Page break background',
          href: '/pages/core-concepts/page-break-background',
        },
        {
          title: 'Limitations',
          href: '/pages/core-concepts/limitations',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/guides',
      title: 'Guides',
      children: [
        {
          title: 'From zero to print-ready',
          href: '/pages/guides/zero-to-print-ready',
        },
        {
          title: 'Pages with tables',
          href: '/pages/guides/table-with-pages',
        },
        {
          title: 'PagesKit: Pages + Table',
          href: '/pages/guides/pageskit-usage',
        },
      ],
    },
  ],
}
