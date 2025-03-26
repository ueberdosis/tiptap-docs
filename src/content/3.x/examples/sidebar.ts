import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'examples',
  rootHref: '/3.x/examples',
  title: 'Examples',
  items: [
    {
      type: 'group',
      title: 'Getting started',
      href: '/3.x/examples',
      children: [
        {
          href: '/3.x/examples',
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
          href: '/3.x/examples/basics/default-text-editor',
        },
        {
          title: 'Formatting',
          href: '/3.x/examples/basics/formatting',
        },
        {
          title: 'Images',
          href: '/3.x/examples/basics/images',
        },
        {
          title: 'Long texts',
          href: '/3.x/examples/basics/long-texts',
        },
        {
          title: 'Markdown shortcuts',
          href: '/3.x/examples/basics/markdown-shortcuts',
        },
        {
          title: 'Minimal setup',
          href: '/3.x/examples/basics/minimal-setup',
        },
        {
          title: 'Tables',
          href: '/3.x/examples/basics/tables',
        },
        {
          title: 'Tasks',
          href: '/3.x/examples/basics/tasks',
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
          href: '/3.x/examples/advanced/clever-editor',
        },
        {
          title: 'Collaborative editing',
          href: '/3.x/examples/advanced/collaborative-editing',
        },
        {
          title: 'Drawing',
          href: '/3.x/examples/advanced/drawing',
        },
        {
          title: 'Forced content structure',
          href: '/3.x/examples/advanced/forced-content-structure',
        },
        {
          title: 'Interactive React & Vue views',
          href: '/3.x/examples/advanced/interactive-react-and-vue-views',
        },
        {
          title: 'Retrieval-Augmented Generation (RAG)',
          href: '/3.x/examples/advanced/retrieval-augmented-generation-rag',
        },
        {
          title: 'React performance',
          href: '/3.x/examples/advanced/react-performance',
        },
        {
          title: 'Menus',
          href: '/3.x/examples/advanced/menus',
        },
        {
          title: 'Mentions',
          href: '/3.x/examples/advanced/mentions',
        },
        {
          title: 'Syntax highlighting',
          href: '/3.x/examples/advanced/syntax-highlighting',
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
          href: '/3.x/examples/experiments/collaborative-fields',
        },
        {
          title: 'Figure',
          href: '/3.x/examples/experiments/figure',
        },
        {
          title: 'Generic figure',
          href: '/3.x/examples/experiments/generic-figure',
        },
        {
          title: 'iFrame',
          href: '/3.x/examples/experiments/iframe',
        },
        {
          title: 'Linting',
          href: '/3.x/examples/experiments/linting',
        },
        {
          title: 'Slash commands',
          href: '/3.x/examples/experiments/slash-commands',
        },
        {
          title: 'Trailing node',
          href: '/3.x/examples/experiments/trailing-node',
        },
      ],
    },
  ],
}
