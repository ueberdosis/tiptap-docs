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
          title: 'Page format',
          href: '/pages/core-concepts/page-format',
        },
        {
          title: 'Headers & Footers',
          href: '/pages/core-concepts/page-header-footer',
        },
        {
          title: 'Page break',
          href: '/pages/core-concepts/page-break',
        },
        {
          title: 'Limitations',
          href: '/pages/core-concepts/limitations',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/utilities',
      title: 'Utilities',
      children: [
        {
          title: 'Page formats',
          href: '/pages/utilities/page-formats',
        },
        {
          title: 'cmToPixels',
          href: '/pages/utilities/cm-to-pixels',
        },
        {
          title: 'inchToPixels',
          href: '/pages/utilities/inch-to-pixels',
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
          title: 'PageKit',
          href: '/pages/guides/pagekit-usage',
        },
        {
          title: 'Adding collaboration to Pages',
          href: '/pages/guides/collaboration-with-pages',
        },
      ],
    },
  ],
}
