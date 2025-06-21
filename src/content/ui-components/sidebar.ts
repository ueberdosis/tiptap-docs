import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ui components',
  rootHref: '/ui-components/getting-started/',
  title: 'Components',
  items: [
    {
      type: 'group',
      href: '/ui-components/getting-started/overview',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/ui-components/getting-started/overview',
        },
        {
          title: 'Style',
          href: '/ui-components/getting-started/style',
        },
        {
          title: 'CLI',
          href: '/ui-components/getting-started/cli',
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
          tags: ['Open Source'],
        },
      ],
    },
    {
      type: 'group',
      href: '/ui-components/installation',
      title: 'Installation',
      children: [
        {
          title: 'Next.js',
          href: '/ui-components/installation/next',
        },
        {
          title: 'Vite',
          href: '/ui-components/installation/vite',
        },
      ],
    },
    {
      type: 'group',
      href: '/ui-components/components',
      title: 'UI Components',
      children: [
        {
          title: 'Overview',
          href: '/ui-components/components/overview',
        },
        {
          title: 'Components',
          href: '/ui-components/components/',
          children: [
            // {
            //   title: 'Comment button',
            //   href: '/ui-components/components/comment-button',
            // },
            // {
            //   title: 'Emoji dropdown',
            //   href: '/ui-components/components/emoji-dropdown-menu',
            // },
            // {
            //   title: 'Floating element',
            //   href: '/ui-components/components/floating-element',
            // },
            // {
            //   title: 'Floating toolbar',
            //   href: '/ui-components/components/floating-toolbar',
            // },
            {
              title: 'Heading button',
              href: '/ui-components/components/heading-button',
            },
            {
              title: 'Heading dropdown',
              href: '/ui-components/components/heading-dropdown-menu',
            },
            {
              title: 'Highlight popover',
              href: '/ui-components/components/highlight-popover',
            },
            {
              title: 'Image upload button',
              href: '/ui-components/components/image-upload-button',
            },
            {
              title: 'Link popover',
              href: '/ui-components/components/link-popover',
            },
            {
              title: 'List button',
              href: '/ui-components/components/list-button',
            },
            {
              title: 'List dropdown',
              href: '/ui-components/components/list-dropdown-menu',
            },
            {
              title: 'Mark button',
              href: '/ui-components/components/mark-button',
            },
            // {
            //   title: 'Math button',
            //   href: '/ui-components/components/math-button',
            // },
            // {
            //   title: 'Mention dropdown',
            //   href: '/ui-components/components/mention-dropdown-menu',
            // },
            {
              title: 'Node button',
              href: '/ui-components/components/node-button',
            },
            // {
            //   title: 'Slash menu',
            //   href: '/ui-components/components/slash-dropdown-menu',
            // },
            {
              title: 'Text align button',
              href: '/ui-components/components/text-align-button',
            },
            // {
            //   title: 'Thread',
            //   href: '/ui-components/components/thread',
            // },
            // {
            //   title: 'Trigger button',
            //   href: '/ui-components/components/trigger-button',
            // },
            {
              title: 'Undo redo button',
              href: '/ui-components/components/undo-redo-button',
            },
          ],
        },
        {
          title: 'Node components',
          href: '/ui-components/node-components',
          children: [
            {
              title: 'Code block node',
              href: '/ui-components/node-components/code-block-node',
            },
            {
              title: 'Image node',
              href: '/ui-components/node-components/image-node',
            },
            {
              title: 'Image upload node',
              href: '/ui-components/node-components/image-upload-node',
            },
            {
              title: 'List node',
              href: '/ui-components/node-components/list-node',
            },
            {
              title: 'Paragraph node',
              href: '/ui-components/node-components/paragraph-node',
            },
          ],
        },
        {
          title: 'Primitives',
          href: '/ui-components/primitives',
          children: [
            // {
            //   title: 'Avatar',
            //   href: '/ui-components/primitives/avatar',
            // },
            // {
            //   title: 'Badge',
            //   href: '/ui-components/primitives/badge',
            // },
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