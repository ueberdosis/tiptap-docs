import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'examples',
  rootHref: '/v3/examples',
  title: 'Examples',
  items: [
    {
      type: 'group',
      title: 'Getting started',
      href: '/v3/examples',
      children: [
        {
          href: '/v3/examples',
          title: 'Overview',
        },
      ],
    },
    {
      type: 'group',
      href: '',
      title: 'Basics',
      children: [
        {
          title: 'Default text editor',
          href: '/v3/examples/basics/default-text-editor',
        },
        {
          title: 'Formatting',
          href: '/v3/examples/basics/formatting',
        },
        {
          title: 'Images',
          href: '/v3/examples/basics/images',
        },
        {
          title: 'Long texts',
          href: '/v3/examples/basics/long-texts',
        },
        {
          title: 'Markdown shortcuts',
          href: '/v3/examples/basics/markdown-shortcuts',
        },
        {
          title: 'Minimal setup',
          href: '/v3/examples/basics/minimal-setup',
        },
        {
          title: 'Tables',
          href: '/v3/examples/basics/tables',
        },
        {
          title: 'Tasks',
          href: '/v3/examples/basics/tasks',
        },
      ],
    },
    {
      type: 'group',
      href: '',
      title: 'Advanced',
      children: [
        {
          title: 'Clever editor',
          href: '/v3/examples/advanced/clever-editor',
        },
        {
          title: 'Collaborative editing',
          href: '/v3/examples/advanced/collaborative-editing',
        },
        {
          title: 'Drawing',
          href: '/v3/examples/advanced/drawing',
        },
        {
          title: 'Forced content structure',
          href: '/v3/examples/advanced/forced-content-structure',
        },
        {
          title: 'Interactive React & Vue views',
          href: '/v3/examples/advanced/interactive-react-and-vue-views',
        },
        {
          title: 'Retrieval-Augmented Generation (RAG)',
          href: '/v3/examples/advanced/retrieval-augmented-generation-rag',
        },
        {
          title: 'React performance',
          href: '/v3/examples/advanced/react-performance',
        },
        {
          title: 'Menus',
          href: '/v3/examples/advanced/menus',
        },
        {
          title: 'Mentions',
          href: '/v3/examples/advanced/mentions',
        },
        {
          title: 'Syntax highlighting',
          href: '/v3/examples/advanced/syntax-highlighting',
        },
      ],
    },
    {
      type: 'group',
      href: '',
      title: 'Experiments',
      children: [
        {
          title: 'Collaborative fields',
          href: '/v3/examples/experiments/collaborative-fields',
        },
        {
          title: 'Figure',
          href: '/v3/examples/experiments/figure',
        },
        {
          title: 'Generic figure',
          href: '/v3/examples/experiments/generic-figure',
        },
        {
          title: 'iFrame',
          href: '/v3/examples/experiments/iframe',
        },
        {
          title: 'Linting',
          href: '/v3/examples/experiments/linting',
        },
        {
          title: 'Slash commands',
          href: '/v3/examples/experiments/slash-commands',
        },
        {
          title: 'Trailing node',
          href: '/v3/examples/experiments/trailing-node',
        },
      ],
    },
  ],
}
