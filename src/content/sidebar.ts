import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'all-docs',
  rootHref: '/',
  title: 'Home',
  items: [
    {
      type: 'group',
      title: 'Getting started',
      href: '/getting-started',
      children: [
        {
          href: '/',
          title: 'Overview',
        },
        {
          href: '/resources/whats-new',
          title: "What's new in 3.0",
        },
      ],
    },
    {
      type: 'group',
      title: 'Browse by feature',
      href: '/suite-docs',
      children: [
        {
          href: '/editor/getting-started/overview',
          title: 'Editor',
        },
        {
          href: '/collaboration/getting-started/overview',
          title: 'Collaboration',
        },
        {
          href: '/comments/getting-started/overview',
          title: 'Comments',
        },
        {
          href: '/content-ai/getting-started/overview',
          title: 'Content AI',
        },
        {
          href: '/collaboration/documents/history',
          title: 'History',
        },
        {
          href: '/conversion/getting-started/overview',
          title: 'Conversion',
        },
        {
          href: '/pages/getting-started/overview',
          title: 'Pages',
        },
        {
          href: '/collaboration/documents/semantic-search',
          title: 'Semantic Search',
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/',
      children: [
        {
          href: '/guides',
          title: 'Guides',
        },
        {
          href: '/examples',
          title: 'Examples',
        },
        {
          href: '/resources/tiptap-trial',
          title: 'Tiptap trial',
        },
        {
          href: '/resources/contributing',
          title: 'Contributing',
        },
        {
          href: '/resources/changelog',
          title: 'Editor changelog',
        },
        {
          href: 'https://tiptap.dev/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
