import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'editor',
  rootHref: '/v3/editor/getting-started/overview',
  title: 'Editor',
  items: [
    {
      type: 'group',
      href: '/v3/editor/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/v3/editor/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/v3/editor/getting-started/install',
          children: [
            {
              href: '/v3/editor/getting-started/install/vanilla-javascript',
              title: 'Vanilla JavaScript',
            },
            {
              href: '/v3/editor/getting-started/install/react',
              title: 'React',
            },
            {
              href: '/v3/editor/getting-started/install/nextjs',
              title: 'Next.js',
            },
            {
              href: '/v3/editor/getting-started/install/vue3',
              title: 'Vue 3',
            },
            {
              href: '/v3/editor/getting-started/install/vue2',
              title: 'Vue 2',
            },
            {
              href: '/v3/editor/getting-started/install/nuxt',
              title: 'Nuxt',
            },
            {
              href: '/v3/editor/getting-started/install/svelte',
              title: 'Svelte',
            },
            {
              href: '/v3/editor/getting-started/install/alpine',
              title: 'Alpine',
            },
            {
              href: '/v3/editor/getting-started/install/php',
              title: 'PHP',
            },
            {
              href: '/v3/editor/getting-started/install/cdn',
              title: 'CDN',
            },
          ],
        },
        {
          title: 'Configure',
          href: '/v3/editor/getting-started/configure',
        },
        {
          title: 'Styling',
          href: '/v3/editor/getting-started/style-editor',
          children: [
            {
              href: '/v3/editor/getting-started/style-editor/custom-menus',
              title: 'Custom menus',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      title: 'Extensions',
      href: '/v3/editor/extensions',
      children: [
        {
          href: '/v3/editor/extensions/overview',
          title: 'Overview',
        },
        {
          href: '/v3/editor/extensions/nodes',
          title: 'Nodes',
          children: [
            {
              href: '/v3/editor/extensions/nodes/blockquote',
              title: 'Blockquote',
            },
            {
              href: '/v3/editor/extensions/nodes/bullet-list',
              title: 'Bullet list',
            },
            {
              href: '/v3/editor/extensions/nodes/code-block',
              title: 'Code block',
            },
            {
              href: '/v3/editor/extensions/nodes/code-block-lowlight',
              title: 'Code block lowlight',
            },
            {
              href: '/v3/editor/extensions/nodes/details',
              title: 'Details',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/nodes/details-content',
              title: 'Details content',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/nodes/details-summary',
              title: 'Details summary',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/nodes/document',
              title: 'Document',
            },
            {
              href: '/v3/editor/extensions/nodes/emoji',
              title: 'Emoji',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/nodes/hard-break',
              title: 'Hard break',
            },
            {
              href: '/v3/editor/extensions/nodes/heading',
              title: 'Heading',
            },
            {
              href: '/v3/editor/extensions/nodes/horizontal-rule',
              title: 'Horizontal rule',
            },
            {
              href: '/v3/editor/extensions/nodes/image',
              title: 'Image',
            },
            {
              href: '/v3/editor/extensions/nodes/list-item',
              title: 'List item',
            },
            {
              href: '/v3/editor/extensions/nodes/mention',
              title: 'Mention',
            },
            {
              href: '/v3/editor/extensions/nodes/ordered-list',
              title: 'Ordered list',
            },
            {
              href: '/v3/editor/extensions/nodes/paragraph',
              title: 'Paragraph',
            },
            {
              href: '/v3/editor/extensions/nodes/table',
              title: 'Table',
            },
            {
              href: '/v3/editor/extensions/nodes/table-cell',
              title: 'Table cell',
            },
            {
              href: '/v3/editor/extensions/nodes/table-header',
              title: 'Table header',
            },
            {
              href: '/v3/editor/extensions/nodes/table-row',
              title: 'Table row',
            },
            {
              href: '/v3/editor/extensions/nodes/task-list',
              title: 'Task list',
            },
            {
              href: '/v3/editor/extensions/nodes/task-item',
              title: 'Task item',
            },
            {
              href: '/v3/editor/extensions/nodes/text',
              title: 'Text',
            },
            {
              href: '/v3/editor/extensions/nodes/youtube',
              title: 'Youtube',
            },
          ],
        },
        {
          href: '/v3/editor/extensions/marks',
          title: 'Marks',
          children: [
            {
              href: '/v3/editor/extensions/marks/bold',
              title: 'Bold',
            },
            {
              href: '/v3/editor/extensions/marks/code',
              title: 'Code',
            },
            {
              href: '/v3/editor/extensions/marks/highlight',
              title: 'Highlight',
            },
            {
              href: '/v3/editor/extensions/marks/italic',
              title: 'Italic',
            },
            {
              href: '/v3/editor/extensions/marks/link',
              title: 'Link',
            },
            {
              href: '/v3/editor/extensions/marks/strike',
              title: 'Strike',
            },
            {
              href: '/v3/editor/extensions/marks/subscript',
              title: 'Subscript',
            },
            {
              href: '/v3/editor/extensions/marks/superscript',
              title: 'Superscript',
            },
            {
              href: '/v3/editor/extensions/marks/text-style',
              title: 'Text Style',
            },
            {
              href: '/v3/editor/extensions/marks/underline',
              title: 'Underline',
            },
          ],
        },
        {
          href: '/v3/editor/extensions/functionality',
          title: 'Functionality',
          children: [
            {
              href: '/v3/editor/extensions/functionality/bubble-menu',
              title: 'Bubble menu',
            },
            {
              href: '/v3/editor/extensions/functionality/character-count',
              title: 'Character count',
            },
            {
              href: '/v3/editor/extensions/functionality/collaboration',
              title: 'Collaboration',
            },
            {
              href: '/v3/editor/extensions/functionality/collaboration-caret',
              title: 'Collaboration Caret',
            },
            {
              href: '/v3/editor/extensions/functionality/background-color',
              title: 'Background Color',
            },
            {
              href: '/v3/editor/extensions/functionality/color',
              title: 'Color',
            },
            {
              href: '/v3/editor/extensions/functionality/comments',
              title: 'Comments',
              tags: ['Beta', 'Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/content-ai',
              title: 'Content AI',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/drag-handle',
              title: 'Drag Handle',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/drag-handle-react',
              title: 'Drag Handle React',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/drag-handle-vue',
              title: 'Drag Handle Vue',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/dropcursor',
              title: 'Dropcursor',
            },
            {
              href: '/v3/editor/extensions/functionality/export',
              title: 'Export',
              tags: ['Beta', 'Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/filehandler',
              title: 'File handler',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/floatingmenu',
              title: 'Floating menu',
            },
            {
              href: '/v3/editor/extensions/functionality/focus',
              title: 'Focus',
            },
            {
              href: '/v3/editor/extensions/functionality/fontfamily',
              title: 'Font family',
            },
            {
              href: '/v3/editor/extensions/functionality/fontsize',
              title: 'Font size',
            },
            {
              href: '/v3/editor/extensions/functionality/gapcursor',
              title: 'Gap cursor',
            },
            {
              href: '/v3/editor/extensions/functionality/invisiblecharacters',
              title: 'Invisible characters',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/line-height',
              title: 'Line Height',
            },
            {
              href: '/v3/editor/extensions/functionality/listkeymap',
              title: 'List Keymap',
            },
            {
              href: '/v3/editor/extensions/functionality/import',
              title: 'Import',
              tags: ['Beta', 'Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/mathematics',
              title: 'Mathematics',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/placeholder',
              title: 'Placeholder',
            },
            {
              href: '/v3/editor/extensions/functionality/snapshot',
              title: 'Snapshot',
              tags: ['Pro', 'Cloud'],
            },
            {
              href: '/v3/editor/extensions/functionality/snapshot-compare',
              title: 'Snapshot Compare',
              tags: ['Pro', 'Cloud'],
            },
            {
              href: '/v3/editor/extensions/functionality/selection',
              title: 'Selection',
            },
            {
              href: '/v3/editor/extensions/functionality/starterkit',
              title: 'Starter kit',
            },
            {
              href: '/v3/editor/extensions/functionality/table-of-contents',
              title: 'Table of contents',
              tags: ['Pro'],
            },
            {
              href: '/v3/editor/extensions/functionality/textalign',
              title: 'Text align',
            },
            {
              href: '/v3/editor/extensions/functionality/trailing-node',
              title: 'Trailing node',
            },
            {
              href: '/v3/editor/extensions/functionality/typography',
              title: 'Typography',
            },
            {
              href: '/v3/editor/extensions/functionality/undo-redo',
              title: 'Undo & Redo History',
            },
            {
              href: '/v3/editor/extensions/functionality/uniqueid',
              title: 'Unique ID',
              tags: ['Pro'],
            },
          ],
        },
        {
          href: '/v3/editor/extensions/custom-extensions',
          title: 'Custom extensions',
          children: [
            {
              href: '/v3/editor/extensions/custom-extensions/create-new',
              title: 'Create new',
              children: [
                {
                  href: '/v3/editor/extensions/custom-extensions/create-new/extension',
                  title: 'Extension API',
                },
                {
                  href: '/v3/editor/extensions/custom-extensions/create-new/node',
                  title: 'Node API',
                },
                {
                  href: '/v3/editor/extensions/custom-extensions/create-new/mark',
                  title: 'Mark API',
                },
              ],
            },
            {
              href: '/v3/editor/extensions/custom-extensions/extend-existing',
              title: 'Extend existing',
            },
            {
              href: '/v3/editor/extensions/custom-extensions/node-views',
              title: 'Node views',
              children: [
                {
                  href: '/v3/editor/extensions/custom-extensions/node-views/javascript',
                  title: 'Javascript',
                },
                {
                  href: '/v3/editor/extensions/custom-extensions/node-views/react',
                  title: 'React',
                },
                {
                  href: '/v3/editor/extensions/custom-extensions/node-views/vue',
                  title: 'Vue',
                },
                {
                  href: '/v3/editor/extensions/custom-extensions/node-views/examples',
                  title: 'Examples',
                },
              ],
            },
            {
              href: '/v3/editor/extensions/custom-extensions/mark-views',
              title: 'Mark views',
              children: [
                {
                  href: '/v3/editor/extensions/custom-extensions/mark-views/javascript',
                  title: 'Javascript',
                },
                {
                  href: '/v3/editor/extensions/custom-extensions/mark-views/react',
                  title: 'React',
                },
                {
                  href: '/v3/editor/extensions/custom-extensions/mark-views/vue',
                  title: 'Vue',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      title: 'Core Concepts',
      href: '/v3/editor/core-concepts',
      children: [
        {
          href: '/v3/editor/core-concepts/introduction',
          title: 'Introduction',
        },
        {
          href: '/v3/editor/core-concepts/extensions',
          title: 'Extensions',
        },
        {
          href: '/v3/editor/core-concepts/nodes-and-marks',
          title: 'Nodes and Marks',
        },
        {
          href: '/v3/editor/core-concepts/schema',
          title: 'Schema',
        },
        {
          href: '/v3/editor/core-concepts/keyboard-shortcuts',
          title: 'Keyboard shortcuts',
        },
        {
          title: 'ProseMirror',
          href: '/v3/editor/core-concepts/prosemirror',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/editor/api',
      title: 'API',
      children: [
        {
          href: '/v3/editor/api/editor',
          title: 'Editor instance',
        },
        {
          href: '/v3/editor/api/commands',
          title: 'Commands',
          children: [
            {
              href: '/v3/editor/api/commands/content',
              title: 'Content',
              children: [
                {
                  href: '/v3/editor/api/commands/content/clear-content',
                  title: 'clearContent',
                },
                {
                  href: '/v3/editor/api/commands/content/cut',
                  title: 'cut',
                },
                {
                  href: '/v3/editor/api/commands/content/insert-content',
                  title: 'insertContent',
                },
                {
                  href: '/v3/editor/api/commands/content/insert-content-at',
                  title: 'insertContentAt',
                },
                {
                  href: '/v3/editor/api/commands/content/set-content',
                  title: 'setContent',
                },
              ],
            },
            {
              href: '/v3/editor/api/commands/nodes-and-marks',
              title: 'Nodes & Marks',
              children: [
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/clear-nodes',
                  title: 'clearNodes',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/create-paragraph-near',
                  title: 'createParagraphNear',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/delete-node',
                  title: 'deleteNode',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/extend-mark-range',
                  title: 'extendMarkRange',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/exit-code',
                  title: 'exitCode',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/join-backward',
                  title: 'joinBackward',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/join-down',
                  title: 'joinDown',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/join-forward',
                  title: 'joinForward',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/join-textblock-backward',
                  title: 'joinTextblockBackward',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/join-textblock-forward',
                  title: 'joinTextblockForward',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/join-up',
                  title: 'joinUp',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/lift',
                  title: 'lift',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/lift-empty-block',
                  title: 'liftEmptyBlock',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/newline-in-code',
                  title: 'newlineInCode',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/reset-attributes',
                  title: 'resetAttributes',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/set-mark',
                  title: 'setMark',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/set-node',
                  title: 'setNode',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/split-block',
                  title: 'splitBlock',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/toggle-mark',
                  title: 'toggleMark',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/toggle-node',
                  title: 'toggleNode',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/toggle-wrap',
                  title: 'toggleWrap',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/undo-input-rule',
                  title: 'undoInputRule',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/unset-all-marks',
                  title: 'unsetAllMarks',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/unset-mark',
                  title: 'unsetMark',
                },
                {
                  href: '/v3/editor/api/commands/nodes-and-marks/update-attributes',
                  title: 'updateAttributes',
                },
              ],
            },
            {
              href: '/v3/editor/api/commands/lists',
              title: 'Lists',
              children: [
                {
                  href: '/v3/editor/api/commands/lists/lift-list-item',
                  title: 'liftListItem',
                },
                {
                  href: '/v3/editor/api/commands/lists/sink-list-item',
                  title: 'sinkListItem',
                },
                {
                  href: '/v3/editor/api/commands/lists/split-list-item',
                  title: 'splitListItem',
                },
                {
                  href: '/v3/editor/api/commands/lists/toggle-list',
                  title: 'toggleList',
                },
                {
                  href: '/v3/editor/api/commands/lists/wrap-in-list',
                  title: 'wrapInList',
                },
              ],
            },
            {
              href: '/v3/editor/api/commands/selection',
              title: 'Selection',
              children: [
                {
                  href: '/v3/editor/api/commands/selection/blur',
                  title: 'blur',
                },
                {
                  href: '/v3/editor/api/commands/selection/delete-range',
                  title: 'deleteRange',
                },
                {
                  href: '/v3/editor/api/commands/selection/delete-selection',
                  title: 'deleteSelection',
                },
                {
                  href: '/v3/editor/api/commands/selection/enter',
                  title: 'enter',
                },
                {
                  href: '/v3/editor/api/commands/selection/focus',
                  title: 'focus',
                },
                {
                  href: '/v3/editor/api/commands/selection/keyboard-shortcut',
                  title: 'keyboardShortcut',
                },
                {
                  href: '/v3/editor/api/commands/selection/scroll-into-view',
                  title: 'scrollIntoView',
                },
                {
                  href: '/v3/editor/api/commands/selection/select-all',
                  title: 'selectAll',
                },
                {
                  href: '/v3/editor/api/commands/selection/select-node-backward',
                  title: 'selectNodeBackward',
                },
                {
                  href: '/v3/editor/api/commands/selection/select-node-forward',
                  title: 'selectNodeForward',
                },
                {
                  href: '/v3/editor/api/commands/selection/select-parent-node',
                  title: 'selectParentNode',
                },
                {
                  href: '/v3/editor/api/commands/selection/set-node-selection',
                  title: 'setNodeSelection',
                },
                {
                  href: '/v3/editor/api/commands/selection/set-text-selection',
                  title: 'setTextSelection',
                },
              ],
            },
            {
              href: '/v3/editor/api/commands/for-each',
              title: 'forEach',
            },
            {
              href: '/v3/editor/api/commands/select-textblock-end',
              title: 'selectTextblockEnd',
            },
            {
              href: '/v3/editor/api/commands/select-textblock-start',
              title: 'selectTextblockStart',
            },
            {
              href: '/v3/editor/api/commands/set-meta',
              title: 'setMeta',
            },
          ],
        },
        {
          href: '/v3/editor/api/utilities',
          title: 'Utilities',
          children: [
            {
              href: '/v3/editor/api/utilities/html',
              title: 'HTML',
            },
            {
              href: '/v3/editor/api/utilities/static-renderer',
              title: 'Static Renderer',
            },
            {
              href: '/v3/editor/api/utilities/suggestion',
              title: 'Suggestion',
            },
            {
              href: '/v3/editor/api/utilities/tiptap-for-php',
              title: 'Tiptap for PHP',
            },
          ],
        },
        {
          href: '/v3/editor/api/node-positions',
          title: 'Node Positions',
        },
        {
          href: '/v3/editor/api/events',
          title: 'Events',
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/v3/editor/resources',
      children: [
        {
          href: '/v3/guides',
          title: 'Guides',
        },
        {
          href: '/v3/resources/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
