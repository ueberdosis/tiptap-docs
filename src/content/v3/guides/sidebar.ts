import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'guides',
  rootHref: '/v3/guides',
  title: 'Guides',
  items: [
    {
      title: 'First Steps',
      href: '',
      type: 'group',
      children: [
        {
          href: '/v3/guides/pro-extensions',
          title: 'Integrate Pro Extensions',
        },
      ],
    },
    {
      title: 'Essential',
      type: 'group',
      href: '',
      children: [
        {
          href: '/v3/guides/faq',
          title: 'FAQ',
        },
        {
          href: '/v3/guides/accessibility',
          title: 'Accessibility',
        },
        {
          href: '/v3/guides/performance',
          title: 'Performance',
        },
        {
          href: '/v3/guides/invalid-schema',
          title: 'Invalid schema handling',
        },
        {
          href: '/v3/guides/output-json-html',
          title: 'Export JSON or HTML',
        },
        {
          href: '/v3/guides/authentication',
          title: 'Collaboration Auth',
        },
        {
          href: '/v3/guides/naming-documents',
          title: 'Naming documents',
        },
        {
          href: '/v3/guides/offline-support',
          title: 'Offline Collaboration',
        },
        {
          href: '/v3/guides/upgrade-tiptap-v1',
          title: 'Upgrade Tiptap V1',
        },
        {
          href: '/v3/guides/upgrade-tiptap-v2',
          title: 'Upgrade Tiptap V2',
        },
      ],
    },
    {
      title: 'Customization',
      type: 'group',
      href: '',
      children: [
        {
          href: '/v3/guides/typescript',
          title: 'Extend with TypeScript',
        },
      ],
    },
  ],
}
