import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'editor',
  rootHref: '/3.x/editor/getting-started/overview',
  title: 'Editor',
  items: [
    {
      type: 'group',
      href: '/3.x/editor/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/3.x/editor/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/3.x/editor/getting-started/install',
          children: [
            {
              href: '/3.x/editor/getting-started/install/vanilla-javascript',
              title: 'Vanilla JavaScript',
            },
            {
              href: '/3.x/editor/getting-started/install/react',
              title: 'React',
            },
            {
              href: '/3.x/editor/getting-started/install/nextjs',
              title: 'Next.js',
            },
            {
              href: '/3.x/editor/getting-started/install/vue3',
              title: 'Vue 3',
            },
            {
              href: '/3.x/editor/getting-started/install/vue2',
              title: 'Vue 2',
            },
            {
              href: '/3.x/editor/getting-started/install/nuxt',
              title: 'Nuxt',
            },
            {
              href: '/3.x/editor/getting-started/install/svelte',
              title: 'Svelte',
            },
            {
              href: '/3.x/editor/getting-started/install/alpine',
              title: 'Alpine',
            },
            {
              href: '/3.x/editor/getting-started/install/php',
              title: 'PHP',
            },
            {
              href: '/3.x/editor/getting-started/install/cdn',
              title: 'CDN',
            },
          ],
        },
        {
          title: 'Configure',
          href: '/3.x/editor/getting-started/configure',
        },
        {
          title: 'Styling',
          href: '/3.x/editor/getting-started/style-editor',
          children: [
            {
              href: '/3.x/editor/getting-started/style-editor/custom-menus',
              title: 'Custom menus',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      title: 'Extensions',
      href: '/3.x/editor/extensions',
      children: [
        {
          href: '/3.x/editor/extensions/overview',
          title: 'Overview',
        },
        {
          href: '/3.x/editor/extensions/nodes',
          title: 'Nodes',
          children: [
            {
              href: '/3.x/editor/extensions/nodes/blockquote',
              title: 'Blockquote',
            },
            {
              href: '/3.x/editor/extensions/nodes/bullet-list',
              title: 'Bullet list',
            },
            {
              href: '/3.x/editor/extensions/nodes/code-block',
              title: 'Code block',
            },
            {
              href: '/3.x/editor/extensions/nodes/code-block-lowlight',
              title: 'Code block lowlight',
            },
            {
              href: '/3.x/editor/extensions/nodes/details',
              title: 'Details',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/nodes/details-content',
              title: 'Details content',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/nodes/details-summary',
              title: 'Details summary',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/nodes/document',
              title: 'Document',
            },
            {
              href: '/3.x/editor/extensions/nodes/emoji',
              title: 'Emoji',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/nodes/hard-break',
              title: 'Hard break',
            },
            {
              href: '/3.x/editor/extensions/nodes/heading',
              title: 'Heading',
            },
            {
              href: '/3.x/editor/extensions/nodes/horizontal-rule',
              title: 'Horizontal rule',
            },
            {
              href: '/3.x/editor/extensions/nodes/image',
              title: 'Image',
            },
            {
              href: '/3.x/editor/extensions/nodes/list-item',
              title: 'List item',
            },
            {
              href: '/3.x/editor/extensions/nodes/mention',
              title: 'Mention',
            },
            {
              href: '/3.x/editor/extensions/nodes/ordered-list',
              title: 'Ordered list',
            },
            {
              href: '/3.x/editor/extensions/nodes/paragraph',
              title: 'Paragraph',
            },
            {
              href: '/3.x/editor/extensions/nodes/table',
              title: 'Table',
            },
            {
              href: '/3.x/editor/extensions/nodes/table-cell',
              title: 'Table cell',
            },
            {
              href: '/3.x/editor/extensions/nodes/table-header',
              title: 'Table header',
            },
            {
              href: '/3.x/editor/extensions/nodes/table-row',
              title: 'Table row',
            },
            {
              href: '/3.x/editor/extensions/nodes/task-list',
              title: 'Task list',
            },
            {
              href: '/3.x/editor/extensions/nodes/task-item',
              title: 'Task item',
            },
            {
              href: '/3.x/editor/extensions/nodes/text',
              title: 'Text',
            },
            {
              href: '/3.x/editor/extensions/nodes/youtube',
              title: 'Youtube',
            },
          ],
        },
        {
          href: '/3.x/editor/extensions/marks',
          title: 'Marks',
          children: [
            {
              href: '/3.x/editor/extensions/marks/bold',
              title: 'Bold',
            },
            {
              href: '/3.x/editor/extensions/marks/code',
              title: 'Code',
            },
            {
              href: '/3.x/editor/extensions/marks/highlight',
              title: 'Highlight',
            },
            {
              href: '/3.x/editor/extensions/marks/italic',
              title: 'Italic',
            },
            {
              href: '/3.x/editor/extensions/marks/link',
              title: 'Link',
            },
            {
              href: '/3.x/editor/extensions/marks/strike',
              title: 'Strike',
            },
            {
              href: '/3.x/editor/extensions/marks/subscript',
              title: 'Subscript',
            },
            {
              href: '/3.x/editor/extensions/marks/superscript',
              title: 'Superscript',
            },
            {
              href: '/3.x/editor/extensions/marks/text-style',
              title: 'Text Style',
            },
            {
              href: '/3.x/editor/extensions/marks/underline',
              title: 'Underline',
            },
          ],
        },
        {
          href: '/3.x/editor/extensions/functionality',
          title: 'Functionality',
          children: [
            {
              href: '/3.x/editor/extensions/functionality/bubble-menu',
              title: 'Bubble menu',
            },
            {
              href: '/3.x/editor/extensions/functionality/character-count',
              title: 'Character count',
            },
            {
              href: '/3.x/editor/extensions/functionality/collaboration',
              title: 'Collaboration',
            },
            {
              href: '/3.x/editor/extensions/functionality/collaboration-caret',
              title: 'Collaboration Caret',
            },
            {
              href: '/3.x/editor/extensions/functionality/background-color',
              title: 'Background Color',
            },
            {
              href: '/3.x/editor/extensions/functionality/color',
              title: 'Color',
            },
            {
              href: '/3.x/editor/extensions/functionality/comments',
              title: 'Comments',
              tags: ['Beta', 'Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/content-ai',
              title: 'Content AI',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/drag-handle',
              title: 'Drag Handle',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/drag-handle-react',
              title: 'Drag Handle React',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/drag-handle-vue',
              title: 'Drag Handle Vue',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/dropcursor',
              title: 'Dropcursor',
            },
            {
              href: '/3.x/editor/extensions/functionality/export',
              title: 'Export',
              tags: ['Beta', 'Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/filehandler',
              title: 'File handler',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/floatingmenu',
              title: 'Floating menu',
            },
            {
              href: '/3.x/editor/extensions/functionality/focus',
              title: 'Focus',
            },
            {
              href: '/3.x/editor/extensions/functionality/fontfamily',
              title: 'Font family',
            },
            {
              href: '/3.x/editor/extensions/functionality/fontsize',
              title: 'Font size',
            },
            {
              href: '/3.x/editor/extensions/functionality/gapcursor',
              title: 'Gap cursor',
            },
            {
              href: '/3.x/editor/extensions/functionality/invisiblecharacters',
              title: 'Invisible characters',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/line-height',
              title: 'Line Height',
            },
            {
              href: '/3.x/editor/extensions/functionality/listkeymap',
              title: 'List Keymap',
            },
            {
              href: '/3.x/editor/extensions/functionality/import',
              title: 'Import',
              tags: ['Beta', 'Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/mathematics',
              title: 'Mathematics',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/placeholder',
              title: 'Placeholder',
            },
            {
              href: '/3.x/editor/extensions/functionality/snapshot',
              title: 'Snapshot',
              tags: ['Pro', 'Cloud'],
            },
            {
              href: '/3.x/editor/extensions/functionality/snapshot-compare',
              title: 'Snapshot Compare',
              tags: ['Pro', 'Cloud'],
            },
            {
              href: '/3.x/editor/extensions/functionality/selection',
              title: 'Selection',
            },
            {
              href: '/3.x/editor/extensions/functionality/starterkit',
              title: 'Starter kit',
            },
            {
              href: '/3.x/editor/extensions/functionality/table-of-contents',
              title: 'Table of contents',
              tags: ['Pro'],
            },
            {
              href: '/3.x/editor/extensions/functionality/textalign',
              title: 'Text align',
            },
            {
              href: '/3.x/editor/extensions/functionality/trailing-node',
              title: 'Trailing node',
            },
            {
              href: '/3.x/editor/extensions/functionality/typography',
              title: 'Typography',
            },
            {
              href: '/3.x/editor/extensions/functionality/undo-redo',
              title: 'Undo & Redo History',
            },
            {
              href: '/3.x/editor/extensions/functionality/uniqueid',
              title: 'Unique ID',
              tags: ['Pro'],
            },
          ],
        },
        {
          href: '/3.x/editor/extensions/custom-extensions',
          title: 'Custom extensions',
          children: [
            {
              href: '/3.x/editor/extensions/custom-extensions/create-new',
              title: 'Create new',
              children: [
                {
                  href: '/3.x/editor/extensions/custom-extensions/create-new/extension',
                  title: 'Extension API',
                },
                {
                  href: '/3.x/editor/extensions/custom-extensions/create-new/node',
                  title: 'Node API',
                },
                {
                  href: '/3.x/editor/extensions/custom-extensions/create-new/mark',
                  title: 'Mark API',
                },
              ],
            },
            {
              href: '/3.x/editor/extensions/custom-extensions/extend-existing',
              title: 'Extend existing',
            },
            {
              href: '/3.x/editor/extensions/custom-extensions/node-views',
              title: 'Node views',
              children: [
                {
                  href: '/3.x/editor/extensions/custom-extensions/node-views/javascript',
                  title: 'Javascript',
                },
                {
                  href: '/3.x/editor/extensions/custom-extensions/node-views/react',
                  title: 'React',
                },
                {
                  href: '/3.x/editor/extensions/custom-extensions/node-views/vue',
                  title: 'Vue',
                },
                {
                  href: '/3.x/editor/extensions/custom-extensions/node-views/examples',
                  title: 'Examples',
                },
              ],
            },
            {
              href: '/3.x/editor/extensions/custom-extensions/mark-views',
              title: 'Mark views',
              children: [
                {
                  href: '/3.x/editor/extensions/custom-extensions/mark-views/javascript',
                  title: 'Javascript',
                },
                {
                  href: '/3.x/editor/extensions/custom-extensions/mark-views/react',
                  title: 'React',
                },
                {
                  href: '/3.x/editor/extensions/custom-extensions/mark-views/vue',
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
      href: '/3.x/editor/core-concepts',
      children: [
        {
          href: '/3.x/editor/core-concepts/introduction',
          title: 'Introduction',
        },
        {
          href: '/3.x/editor/core-concepts/extensions',
          title: 'Extensions',
        },
        {
          href: '/3.x/editor/core-concepts/nodes-and-marks',
          title: 'Nodes and Marks',
        },
        {
          href: '/3.x/editor/core-concepts/schema',
          title: 'Schema',
        },
        {
          href: '/3.x/editor/core-concepts/keyboard-shortcuts',
          title: 'Keyboard shortcuts',
        },
        {
          title: 'ProseMirror',
          href: '/3.x/editor/core-concepts/prosemirror',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/editor/api',
      title: 'API',
      children: [
        {
          href: '/3.x/editor/api/editor',
          title: 'Editor instance',
        },
        {
          href: '/3.x/editor/api/commands',
          title: 'Commands',
          children: [
            {
              href: '/3.x/editor/api/commands/content',
              title: 'Content',
              children: [
                {
                  href: '/3.x/editor/api/commands/content/clear-content',
                  title: 'clearContent',
                },
                {
                  href: '/3.x/editor/api/commands/content/cut',
                  title: 'cut',
                },
                {
                  href: '/3.x/editor/api/commands/content/insert-content',
                  title: 'insertContent',
                },
                {
                  href: '/3.x/editor/api/commands/content/insert-content-at',
                  title: 'insertContentAt',
                },
                {
                  href: '/3.x/editor/api/commands/content/set-content',
                  title: 'setContent',
                },
              ],
            },
            {
              href: '/3.x/editor/api/commands/nodes-and-marks',
              title: 'Nodes & Marks',
              children: [
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/clear-nodes',
                  title: 'clearNodes',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/create-paragraph-near',
                  title: 'createParagraphNear',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/delete-node',
                  title: 'deleteNode',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/extend-mark-range',
                  title: 'extendMarkRange',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/exit-code',
                  title: 'exitCode',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/join-backward',
                  title: 'joinBackward',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/join-down',
                  title: 'joinDown',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/join-forward',
                  title: 'joinForward',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/join-textblock-backward',
                  title: 'joinTextblockBackward',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/join-textblock-forward',
                  title: 'joinTextblockForward',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/join-up',
                  title: 'joinUp',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/lift',
                  title: 'lift',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/lift-empty-block',
                  title: 'liftEmptyBlock',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/newline-in-code',
                  title: 'newlineInCode',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/reset-attributes',
                  title: 'resetAttributes',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/set-mark',
                  title: 'setMark',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/set-node',
                  title: 'setNode',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/split-block',
                  title: 'splitBlock',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/toggle-mark',
                  title: 'toggleMark',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/toggle-node',
                  title: 'toggleNode',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/toggle-wrap',
                  title: 'toggleWrap',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/undo-input-rule',
                  title: 'undoInputRule',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/unset-all-marks',
                  title: 'unsetAllMarks',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/unset-mark',
                  title: 'unsetMark',
                },
                {
                  href: '/3.x/editor/api/commands/nodes-and-marks/update-attributes',
                  title: 'updateAttributes',
                },
              ],
            },
            {
              href: '/3.x/editor/api/commands/lists',
              title: 'Lists',
              children: [
                {
                  href: '/3.x/editor/api/commands/lists/lift-list-item',
                  title: 'liftListItem',
                },
                {
                  href: '/3.x/editor/api/commands/lists/sink-list-item',
                  title: 'sinkListItem',
                },
                {
                  href: '/3.x/editor/api/commands/lists/split-list-item',
                  title: 'splitListItem',
                },
                {
                  href: '/3.x/editor/api/commands/lists/toggle-list',
                  title: 'toggleList',
                },
                {
                  href: '/3.x/editor/api/commands/lists/wrap-in-list',
                  title: 'wrapInList',
                },
              ],
            },
            {
              href: '/3.x/editor/api/commands/selection',
              title: 'Selection',
              children: [
                {
                  href: '/3.x/editor/api/commands/selection/blur',
                  title: 'blur',
                },
                {
                  href: '/3.x/editor/api/commands/selection/delete-range',
                  title: 'deleteRange',
                },
                {
                  href: '/3.x/editor/api/commands/selection/delete-selection',
                  title: 'deleteSelection',
                },
                {
                  href: '/3.x/editor/api/commands/selection/enter',
                  title: 'enter',
                },
                {
                  href: '/3.x/editor/api/commands/selection/focus',
                  title: 'focus',
                },
                {
                  href: '/3.x/editor/api/commands/selection/keyboard-shortcut',
                  title: 'keyboardShortcut',
                },
                {
                  href: '/3.x/editor/api/commands/selection/scroll-into-view',
                  title: 'scrollIntoView',
                },
                {
                  href: '/3.x/editor/api/commands/selection/select-all',
                  title: 'selectAll',
                },
                {
                  href: '/3.x/editor/api/commands/selection/select-node-backward',
                  title: 'selectNodeBackward',
                },
                {
                  href: '/3.x/editor/api/commands/selection/select-node-forward',
                  title: 'selectNodeForward',
                },
                {
                  href: '/3.x/editor/api/commands/selection/select-parent-node',
                  title: 'selectParentNode',
                },
                {
                  href: '/3.x/editor/api/commands/selection/set-node-selection',
                  title: 'setNodeSelection',
                },
                {
                  href: '/3.x/editor/api/commands/selection/set-text-selection',
                  title: 'setTextSelection',
                },
              ],
            },
            {
              href: '/3.x/editor/api/commands/for-each',
              title: 'forEach',
            },
            {
              href: '/3.x/editor/api/commands/select-textblock-end',
              title: 'selectTextblockEnd',
            },
            {
              href: '/3.x/editor/api/commands/select-textblock-start',
              title: 'selectTextblockStart',
            },
            {
              href: '/3.x/editor/api/commands/set-meta',
              title: 'setMeta',
            },
          ],
        },
        {
          href: '/3.x/editor/api/utilities',
          title: 'Utilities',
          children: [
            {
              href: '/3.x/editor/api/utilities/html',
              title: 'HTML',
            },
            {
              href: '/3.x/editor/api/utilities/static-renderer',
              title: 'Static Renderer',
            },
            {
              href: '/3.x/editor/api/utilities/suggestion',
              title: 'Suggestion',
            },
            {
              href: '/3.x/editor/api/utilities/tiptap-for-php',
              title: 'Tiptap for PHP',
            },
          ],
        },
        {
          href: '/3.x/editor/api/node-positions',
          title: 'Node Positions',
        },
        {
          href: '/3.x/editor/api/events',
          title: 'Events',
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/3.x/editor/resources',
      children: [
        {
          href: '/3.x/guides',
          title: 'Guides',
        },
        {
          href: '/3.x/resources/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
