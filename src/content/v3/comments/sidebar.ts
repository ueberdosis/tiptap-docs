import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'comments',
  rootHref: '/v3/comments/getting-started/overview',
  title: 'Comments',
  items: [
    {
      type: 'group',
      href: '/v3/comments/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/v3/comments/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/v3/comments/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/comments/core-concepts',
      title: 'Core concepts',
      children: [
        {
          title: 'Manage threads',
          href: '/v3/comments/core-concepts/manage-threads',
        },
        {
          title: 'Style threads',
          href: '/v3/comments/core-concepts/style-threads',
        },
        {
          title: 'Configure',
          href: '/v3/comments/core-concepts/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/comments/integrate',
      title: 'Integrate',
      children: [
        {
          title: 'Editor commands',
          href: '/v3/comments/integrate/editor-commands',
        },
        {
          title: 'REST API',
          href: '/v3/comments/integrate/rest-api',
        },
        {
          title: 'Webhook',
          href: '/v3/comments/integrate/webhook',
        },
      ],
    },
  ],
}
