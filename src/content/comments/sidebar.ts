import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'comments',
  rootHref: '/comments/getting-started/overview',
  title: 'Comments',
  items: [
    {
      type: 'group',
      href: '/comments/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/comments/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/comments/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/comments/core-concepts',
      title: 'Core concepts',
      children: [
        {
          title: 'Manage threads',
          href: '/comments/core-concepts/manage-threads',
        },
        {
          title: 'Style threads',
          href: '/comments/core-concepts/style-threads',
        },
        {
          title: 'Configure',
          href: '/comments/core-concepts/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/comments/integrate',
      title: 'Integrate',
      children: [
        {
          title: 'Editor commands',
          href: '/comments/integrate/editor-commands',
        },
        {
          title: 'REST API',
          href: '/comments/integrate/rest-api',
        },
        {
          title: 'Webhook',
          href: '/comments/integrate/webhook',
        },
      ],
    },
  ],
}
