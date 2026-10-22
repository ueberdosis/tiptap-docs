import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'editor',
  rootHref: '/editor/getting-started/overview',
  title: 'Editor',
  items: [
    {
      type: 'group',
      href: '/editor/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/editor/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/editor/getting-started/install',
          children: [
            {
              href: '/editor/getting-started/install/vanilla-javascript',
              title: 'Vanilla JavaScript',
            },
            {
              href: '/editor/getting-started/install/react',
              title: 'React',
            },
            {
              href: '/editor/getting-started/install/nextjs',
              title: 'Next.js',
            },
            {
              href: '/editor/getting-started/install/vue3',
              title: 'Vue 3',
            },
            {
              href: '/editor/getting-started/install/vue2',
              title: 'Vue 2',
            },
            {
              href: '/editor/getting-started/install/nuxt',
              title: 'Nuxt',
            },
            {
              href: '/editor/getting-started/install/svelte',
              title: 'Svelte',
            },
            {
              href: '/editor/getting-started/install/alpine',
              title: 'Alpine',
            },
            {
              href: '/editor/getting-started/install/php',
              title: 'PHP',
            },
            {
              href: '/editor/getting-started/install/vanilla-javascript#without-a-build-tool-cdn',
              title: 'CDN',
            },
          ],
        },
        {
          title: 'Configure',
          href: '/editor/getting-started/configure',
        },
        {
          title: 'Styling',
          href: '/editor/getting-started/style-editor',
          children: [
            {
              href: '/editor/getting-started/style-editor/custom-menus',
              title: 'Custom menus',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      title: 'Extensions',
      href: '/editor/extensions',
      children: [
        {
          href: '/editor/extensions/overview',
          title: 'Overview',
        },
        // The extensions themselves come from the catalog (src/content/catalog.ts)
        {
          href: '/editor/extensions/custom-extensions',
          title: 'Custom extensions',
          children: [
            {
              href: '/editor/extensions/custom-extensions/create-new',
              title: 'Create new',
              children: [
                {
                  href: '/editor/extensions/custom-extensions/create-new/extension',
                  title: 'Extension API',
                },
                {
                  href: '/editor/extensions/custom-extensions/create-new/node',
                  title: 'Node API',
                },
                {
                  href: '/editor/extensions/custom-extensions/create-new/mark',
                  title: 'Mark API',
                },
              ],
            },
            {
              href: '/editor/extensions/custom-extensions/extend-existing',
              title: 'Extend existing',
            },
            {
              href: '/editor/extensions/custom-extensions/node-views',
              title: 'Node views',
              children: [
                {
                  href: '/editor/extensions/custom-extensions/node-views/javascript',
                  title: 'Javascript',
                },
                {
                  href: '/editor/extensions/custom-extensions/node-views/react',
                  title: 'React',
                },
                {
                  href: '/editor/extensions/custom-extensions/node-views/vue',
                  title: 'Vue',
                },
                {
                  href: '/editor/extensions/custom-extensions/node-views/examples',
                  title: 'Examples',
                },
              ],
            },
            {
              href: '/editor/extensions/custom-extensions/mark-views',
              title: 'Mark views',
              children: [
                {
                  href: '/editor/extensions/custom-extensions/mark-views/javascript',
                  title: 'Javascript',
                },
                {
                  href: '/editor/extensions/custom-extensions/mark-views/react',
                  title: 'React',
                },
                {
                  href: '/editor/extensions/custom-extensions/mark-views/vue',
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
      href: '/editor/core-concepts',
      children: [
        {
          href: '/editor/core-concepts/introduction',
          title: 'Overview',
        },
        {
          href: '/editor/core-concepts/extensions',
          title: 'Extensions',
        },
        {
          href: '/editor/core-concepts/nodes-and-marks',
          title: 'Nodes and Marks',
        },
        {
          href: '/editor/core-concepts/schema',
          title: 'Schema',
        },
        {
          href: '/editor/core-concepts/decorations',
          title: 'Decorations',
        },
        {
          href: '/editor/core-concepts/keyboard-shortcuts',
          title: 'Keyboard shortcuts',
        },
        {
          title: 'Persistence',
          href: '/editor/core-concepts/persistence',
        },
        {
          title: 'ProseMirror',
          href: '/editor/core-concepts/prosemirror',
        },
      ],
    },
    {
      type: 'group',
      href: '/editor/markdown',
      title: 'Markdown',
      tags: ['beta'],
      children: [
        { href: '/editor/markdown', title: 'Overview' },
        {
          href: '/editor/markdown/getting-started',
          title: 'Getting Started',
          children: [
            {
              title: 'Installation & Setup',
              href: '/editor/markdown/getting-started/installation',
            },
            {
              title: 'Basic Usage',
              href: '/editor/markdown/getting-started/basic-usage',
            },
          ],
        },
        {
          href: '/editor/markdown/advanced-usage',
          title: 'Advanced Usage',
          children: [
            {
              title: 'Custom Tokenizer',
              href: '/editor/markdown/advanced-usage/custom-tokenizer',
            },
            {
              title: 'Custom Parsing',
              href: '/editor/markdown/advanced-usage/custom-parsing',
            },
            {
              title: 'Custom Serializing',
              href: '/editor/markdown/advanced-usage/custom-serializing',
            },
          ],
        },
        {
          href: '/editor/markdown/guides',
          title: 'Guides',
          children: [
            {
              title: 'Integrate Markdown in your Extension',
              href: '/editor/markdown/guides/integrate-markdown-in-your-extension',
            },
            {
              title: 'Create a Highlight Extension',
              href: '/editor/markdown/guides/create-a-highlight-mark',
            },
            {
              title: 'Create a Admonition Extension',
              href: '/editor/markdown/guides/create-a-admonition-block',
            },
            {
              title: 'Create a Emoji Extension',
              href: '/editor/markdown/guides/create-a-emoji-inline-block',
            },
          ],
        },
        { href: '/editor/markdown/examples', title: 'Examples' },
        {
          href: '/editor/markdown/api',
          title: 'API Reference',
          children: [
            {
              title: 'Editor',
              href: '/editor/markdown/api/editor',
            },
            {
              title: 'MarkdownManager',
              href: '/editor/markdown/api/markdown-manager',
            },
            {
              title: 'Extension',
              href: '/editor/markdown/api/extension',
            },
            {
              title: 'Utilities',
              href: '/editor/markdown/api/utilities',
            },
            {
              title: 'Types',
              href: '/editor/markdown/api/types',
            },
          ],
        },
        { href: '/editor/markdown/glossary', title: 'Glossary' },
      ],
    },
    {
      type: 'group',
      href: '/editor/api',
      title: 'API',
      children: [
        {
          href: '/editor/api/editor',
          title: 'Editor instance',
        },
        {
          href: '/editor/api/commands',
          title: 'Commands',
          children: [
            {
              href: '/editor/api/commands/content',
              title: 'Content',
              children: [
                {
                  href: '/editor/api/commands/content/clear-content',
                  title: 'clearContent',
                },
                {
                  href: '/editor/api/commands/content/cut',
                  title: 'cut',
                },
                {
                  href: '/editor/api/commands/content/insert-content',
                  title: 'insertContent',
                },
                {
                  href: '/editor/api/commands/content/insert-content-at',
                  title: 'insertContentAt',
                },
                {
                  href: '/editor/api/commands/content/set-content',
                  title: 'setContent',
                },
              ],
            },
            {
              href: '/editor/api/commands/nodes-and-marks',
              title: 'Nodes & Marks',
              children: [
                {
                  href: '/editor/api/commands/nodes-and-marks/clear-nodes',
                  title: 'clearNodes',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/create-paragraph-near',
                  title: 'createParagraphNear',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/delete-node',
                  title: 'deleteNode',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/extend-mark-range',
                  title: 'extendMarkRange',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/exit-code',
                  title: 'exitCode',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/join-backward',
                  title: 'joinBackward',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/join-down',
                  title: 'joinDown',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/join-forward',
                  title: 'joinForward',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/join-textblock-backward',
                  title: 'joinTextblockBackward',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/join-textblock-forward',
                  title: 'joinTextblockForward',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/join-up',
                  title: 'joinUp',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/lift',
                  title: 'lift',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/lift-empty-block',
                  title: 'liftEmptyBlock',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/newline-in-code',
                  title: 'newlineInCode',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/reset-attributes',
                  title: 'resetAttributes',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/set-mark',
                  title: 'setMark',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/set-node',
                  title: 'setNode',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/set-text-direction',
                  title: 'setTextDirection',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/split-block',
                  title: 'splitBlock',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/toggle-mark',
                  title: 'toggleMark',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/toggle-node',
                  title: 'toggleNode',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/toggle-wrap',
                  title: 'toggleWrap',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/undo-input-rule',
                  title: 'undoInputRule',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/unset-all-marks',
                  title: 'unsetAllMarks',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/unset-mark',
                  title: 'unsetMark',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/unset-text-direction',
                  title: 'unsetTextDirection',
                },
                {
                  href: '/editor/api/commands/nodes-and-marks/update-attributes',
                  title: 'updateAttributes',
                },
              ],
            },
            {
              href: '/editor/api/commands/lists',
              title: 'Lists',
              children: [
                {
                  href: '/editor/api/commands/lists/lift-list-item',
                  title: 'liftListItem',
                },
                {
                  href: '/editor/api/commands/lists/sink-list-item',
                  title: 'sinkListItem',
                },
                {
                  href: '/editor/api/commands/lists/split-list-item',
                  title: 'splitListItem',
                },
                {
                  href: '/editor/api/commands/lists/toggle-list',
                  title: 'toggleList',
                },
                {
                  href: '/editor/api/commands/lists/wrap-in-list',
                  title: 'wrapInList',
                },
              ],
            },
            {
              href: '/editor/api/commands/selection',
              title: 'Selection',
              children: [
                {
                  href: '/editor/api/commands/selection/blur',
                  title: 'blur',
                },
                {
                  href: '/editor/api/commands/selection/delete-range',
                  title: 'deleteRange',
                },
                {
                  href: '/editor/api/commands/selection/delete-selection',
                  title: 'deleteSelection',
                },
                {
                  href: '/editor/api/commands/selection/enter',
                  title: 'enter',
                },
                {
                  href: '/editor/api/commands/selection/focus',
                  title: 'focus',
                },
                {
                  href: '/editor/api/commands/selection/keyboard-shortcut',
                  title: 'keyboardShortcut',
                },
                {
                  href: '/editor/api/commands/selection/scroll-into-view',
                  title: 'scrollIntoView',
                },
                {
                  href: '/editor/api/commands/selection/select-all',
                  title: 'selectAll',
                },
                {
                  href: '/editor/api/commands/selection/select-node-backward',
                  title: 'selectNodeBackward',
                },
                {
                  href: '/editor/api/commands/selection/select-node-forward',
                  title: 'selectNodeForward',
                },
                {
                  href: '/editor/api/commands/selection/select-parent-node',
                  title: 'selectParentNode',
                },
                {
                  href: '/editor/api/commands/selection/set-node-selection',
                  title: 'setNodeSelection',
                },
                {
                  href: '/editor/api/commands/selection/set-text-selection',
                  title: 'setTextSelection',
                },
              ],
            },
            {
              href: '/editor/api/commands/for-each',
              title: 'forEach',
            },
            {
              href: '/editor/api/commands/select-textblock-end',
              title: 'selectTextblockEnd',
            },
            {
              href: '/editor/api/commands/select-textblock-start',
              title: 'selectTextblockStart',
            },
            {
              href: '/editor/api/commands/set-meta',
              title: 'setMeta',
            },
          ],
        },
        {
          href: '/editor/api/utilities',
          title: 'Utilities',
          children: [
            {
              href: '/editor/api/utilities/html',
              title: 'HTML',
            },
            {
              href: '/editor/api/utilities/jsx',
              title: 'JSX',
            },
            {
              href: '/editor/api/utilities/position',
              title: 'Position',
            },
            {
              href: '/editor/api/utilities/static-renderer',
              title: 'Static Renderer',
            },
            {
              href: '/editor/api/utilities/suggestion',
              title: 'Suggestion',
            },
            {
              href: '/editor/api/utilities/tiptap-for-php',
              title: 'Tiptap for PHP',
            },
          ],
        },
        {
          href: '/editor/api/node-positions',
          title: 'Node Positions',
        },
        {
          href: '/editor/api/decorations',
          title: 'Decorations',
        },
        {
          title: 'Resizable Node views',
          href: '/editor/api/resizable-nodeviews',
        },
        {
          href: '/editor/api/events',
          title: 'Events',
        },
        {
          href: '/editor/api/input-rules',
          title: 'Input Rules',
        },
        {
          href: '/editor/api/paste-rules',
          title: 'Paste Rules',
        },
      ],
    },
    {
      type: 'group',
      title: 'Guides',
      href: '/editor/guides',
      children: [
        { href: '/editor/guides/output-json-html', title: 'Export JSON or HTML' },
        { href: '/editor/guides/invalid-schema', title: 'Invalid schema handling' },
        { href: '/editor/guides/react-composable-api', title: 'React Composable API' },
        { href: '/editor/guides/spellcheck', title: 'Spellcheck' },
        { href: '/editor/guides/find-and-replace', title: 'Find and replace UI' },
      ],
    },
    {
      type: 'group',
      title: 'Customization guides',
      href: '/editor/guides',
      children: [
        { href: '/editor/guides/create-mark', title: 'Create a mark' },
        { href: '/editor/guides/nested-node-view-content', title: 'Nested node views' },
        { href: '/editor/guides/decorations-vanilla', title: 'Decorations in JavaScript' },
        { href: '/editor/guides/decorations-react', title: 'Decorations in React' },
        { href: '/editor/guides/decorations-vue', title: 'Decorations in Vue' },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/editor/resources',
      children: [
        {
          href: '/guides',
          title: 'Guides',
        },
        {
          href: 'https://tiptap.dev/pro-license',
          title: 'Pro license',
        },
      ],
    },
  ],
}
