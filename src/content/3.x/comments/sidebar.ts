import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'comments',
  rootHref: '/3.x/comments/getting-started/overview',
  title: 'Comments',
  items: [
    {
      type: 'group',
      href: '/3.x/comments/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/3.x/comments/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/3.x/comments/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/comments/core-concepts',
      title: 'Core concepts',
      children: [
        {
          title: 'Manage threads',
          href: '/3.x/comments/core-concepts/manage-threads',
        },
        {
          title: 'Style threads',
          href: '/3.x/comments/core-concepts/style-threads',
        },
        {
          title: 'Configure',
          href: '/3.x/comments/core-concepts/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/comments/integrate',
      title: 'Integrate',
      children: [
        {
          title: 'Editor commands',
          href: '/3.x/comments/integrate/editor-commands',
        },
        {
          title: 'REST API',
          href: '/3.x/comments/integrate/rest-api',
        },
        {
          title: 'Webhook',
          href: '/3.x/comments/integrate/webhook',
        },
      ],
    },
  ],
}
