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
        {
          title: 'Notion Editor',
          href: '/ui-components/templates/notion-editor',
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
            {
              title: 'Blockquote button',
              href: '/ui-components/components/blockquote-button',
            },
            {
              title: 'Code block button',
              href: '/ui-components/components/code-block-button',
            },
            {
              title: 'Color highlight button',
              href: '/ui-components/components/color-highlight-button',
            },
            {
              title: 'Color highlight popover',
              href: '/ui-components/components/color-highlight-popover',
            },
            {
              title: 'Color text button',
              href: '/ui-components/components/color-text-button',
            },
            {
              title: 'Color text popover',
              href: '/ui-components/components/color-text-popover',
            },
            {
              title: 'Copy to clipboard button',
              href: '/ui-components/components/copy-to-clipboard-button',
            },
            {
              title: 'Delete node button',
              href: '/ui-components/components/delete-node-button',
            },
            {
              title: 'Duplicate button',
              href: '/ui-components/components/duplicate-button',
            },
            {
              title: 'Emoji dropdown menu',
              href: '/ui-components/components/emoji-dropdown-menu',
            },
            {
              title: 'Emoji trigger button',
              href: '/ui-components/components/emoji-trigger-button',
            },
            {
              title: 'Heading button',
              href: '/ui-components/components/heading-button',
            },
            {
              title: 'Heading dropdown',
              href: '/ui-components/components/heading-dropdown-menu',
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
            {
              title: 'Mention dropdown',
              href: '/ui-components/components/mention-dropdown-menu',
            },
            {
              title: 'Mention trigger button',
              href: '/ui-components/components/mention-trigger-button',
            },
            {
              title: 'Reset all formatting button',
              href: '/ui-components/components/reset-all-formatting-button',
            },
            {
              title: 'Slash trigger button',
              href: '/ui-components/components/slash-command-trigger-button',
            },
            {
              title: 'Slash dropdown menu',
              href: '/ui-components/components/slash-dropdown-menu',
            },
            {
              title: 'Text align button',
              href: '/ui-components/components/text-align-button',
            },
            {
              title: 'Text button',
              href: '/ui-components/components/text-button',
            },
            {
              title: 'Undo redo button',
              href: '/ui-components/components/undo-redo-button',
            },
          ],
        },
        {
          title: 'Utils components',
          href: '/ui-components/utils-components',
          children: [
            {
              title: 'Floating element',
              href: '/ui-components/utils-components/floating-element',
            },
            {
              title: 'Suggestion menu',
              href: '/ui-components/utils-components/suggestion-menu',
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
