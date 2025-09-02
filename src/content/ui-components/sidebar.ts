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
          tags: ['MIT licensed'],
        },
        {
          title: 'Notion Editor',
          href: '/ui-components/templates/notion-like-editor',
          tags: ['Start'],
        },
      ],
    },
    {
      type: 'group',
      href: '/ui-components/install',
      title: 'Install',
      children: [
        {
          title: 'Next.js',
          href: '/ui-components/install/next',
        },
        {
          title: 'Vite',
          href: '/ui-components/install/vite',
        },
        {
          title: 'React Router',
          href: '/ui-components/install/react-router',
        },
        {
          title: 'Laravel',
          href: '/ui-components/install/laravel',
        },
        {
          title: 'Astro',
          href: '/ui-components/install/astro',
        },
        {
          title: 'Manual',
          href: '/ui-components/install/manual',
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
              title: 'Ai ask button',
              href: '/ui-components/components/ai-ask-button',
            },
            {
              title: 'Ai menu',
              href: '/ui-components/components/ai-menu',
            },
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
              title: 'Copy anchor link button',
              href: '/ui-components/components/copy-anchor-link-button',
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
              title: 'Drag context menu',
              href: '/ui-components/components/drag-context-menu',
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
              title: 'Emoji menu',
              href: '/ui-components/components/emoji-menu',
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
              title: 'Image align button',
              href: '/ui-components/components/image-align-button',
            },
            {
              title: 'Image upload button',
              href: '/ui-components/components/image-upload-button',
            },
            {
              title: 'Improve dropdown',
              href: '/ui-components/components/improve-dropdown',
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
              title: 'Move node button',
              href: '/ui-components/components/move-node-button',
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
              title: 'Turn into dropdown',
              href: '/ui-components/components/turn-into-dropdown',
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
              title: 'Blockquote node',
              href: '/ui-components/node-components/blockquote-node',
            },
            {
              title: 'Code block node',
              href: '/ui-components/node-components/code-block-node',
            },
            {
              title: 'Heading node',
              href: '/ui-components/node-components/heading-node',
            },
            {
              title: 'Horizontal rule node',
              href: '/ui-components/node-components/horizontal-rule-node',
            },
            {
              title: 'Image node',
              href: '/ui-components/node-components/image-node',
            },
            {
              title: 'Image node pro',
              href: '/ui-components/node-components/image-node-pro',
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
              title: 'Card',
              href: '/ui-components/primitives/card',
            },
            {
              title: 'Combobox',
              href: '/ui-components/primitives/combobox',
            },
            {
              title: 'Dropdown menu',
              href: '/ui-components/primitives/dropdown-menu',
            },
            {
              title: 'Input',
              href: '/ui-components/primitives/input',
            },
            {
              title: 'Label',
              href: '/ui-components/primitives/label',
            },
            {
              title: 'Menu',
              href: '/ui-components/primitives/menu',
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
              title: 'Textarea Autosize',
              href: '/ui-components/primitives/textarea-autosize',
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
    {
      type: 'group',
      title: 'Resources',
      href: '/ui-components/resources',
      children: [
        {
          href: 'https://tiptap.dev/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
