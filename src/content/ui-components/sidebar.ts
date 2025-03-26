import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ui components',
  rootHref: '/ui-components/getting-started/overview',
  title: 'Components',
  items: [
    {
      type: 'group',
      href: '/ui-components/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/ui-components/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/ui-components/getting-started/install',
        },
        {
          title: 'CLI',
          href: '/ui-components/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/ui-components/templates',
      title: 'Templates',
      children: [
        {
          title: 'Simple Editor',
          href: '/ui-components/templates/simple-editor',
        },
        {
          title: 'Collaborative',
          href: '/ui-components/templates/collaborative',
          tags: ['Coming Soon'],
        },
      ],
    },
    {
      type: 'group',
      href: '/ui-components/elements',
      title: 'UI Components',
      children: [
        {
          title: 'Overview',
          href: '/ui-components/components',
        },
        {
          title: 'Components',
          href: '/ui-components/components',
          children: [
            {
              title: 'Privacy',
              href: '/content-ai/resources/privacy',
            },
          ],
        },
        {
          title: 'Node components',
          href: '/ui-components/node-components',
          children: [
            {
              title: 'Code block',
              href: '/ui-components/node-components/code-block-node',
            },
            {
              title: 'Image node',
              href: '/ui-components/node-components/image-node',
            },
            {
              title: 'Image upload',
              href: '/ui-components/node-components/image-upload-node',
            },
            {
              title: 'List node',
              href: '/ui-components/node-components/list-node',
            },
          ],
        },
        {
          type: 'group',
          title: 'Primitives',
          href: '/ui-components/primitives',
          children: [
            {
              title: 'Avatar',
              href: '/ui-components/primitives/avatar',
            },
            {
              title: 'Badge',
              href: '/ui-components/primitives/badge',
            },
            {
              title: 'Button',
              href: '/ui-components/primitives/button',
            },
            {
              title: 'Dropdown menu',
              href: '/ui-components/primitives/dropdown-menu',
            },
            {
              title: 'Popover',
              href: '/ui-components/primitives/popover',
            },
            {
              title: 'Separator',
              href: '/ui-components/primitives/separator',
            },
            {
              title: 'Spacer',
              href: '/ui-components/primitives/spacer',
            },
            {
              title: 'Toolbar',
              href: '/ui-components/primitives/toolbar',
            },
            {
              title: 'Tooltip',
              href: '/ui-components/primitives/tooltip',
            },
          ],
        },
      ],
    },
  ],
}
