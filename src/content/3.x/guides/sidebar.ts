import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'guides',
  rootHref: '/3.x/guides',
  title: 'Guides',
  items: [
    {
      title: 'First Steps',
      href: '',
      type: 'group',
      children: [
        {
          href: '/3.x/guides/pro-extensions',
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
          href: '/3.x/guides/faq',
          title: 'FAQ',
        },
        {
          href: '/3.x/guides/accessibility',
          title: 'Accessibility',
        },
        {
          href: '/3.x/guides/performance',
          title: 'Performance',
        },
        {
          href: '/3.x/guides/invalid-schema',
          title: 'Invalid schema handling',
        },
        {
          href: '/3.x/guides/output-json-html',
          title: 'Export JSON or HTML',
        },
        {
          href: '/3.x/guides/authentication',
          title: 'Collaboration Auth',
        },
        {
          href: '/3.x/guides/naming-documents',
          title: 'Naming documents',
        },
        {
          href: '/3.x/guides/offline-support',
          title: 'Offline Collaboration',
        },
        {
          href: '/3.x/guides/upgrade-tiptap-v1',
          title: 'Upgrade Tiptap V1',
        },
        {
          href: '/3.x/guides/upgrade-tiptap-v2',
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
          href: '/3.x/guides/typescript',
          title: 'Extend with TypeScript',
        },
      ],
    },
  ],
}
