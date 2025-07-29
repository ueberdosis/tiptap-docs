import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'examples',
  rootHref: '/examples',
  title: 'Examples',
  items: [
    {
      type: 'group',
      title: 'Get started',
      href: '/examples',
      children: [
        {
          href: '/examples',
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
          href: '/examples/basics/default-text-editor',
        },
        {
          title: 'Formatting',
          href: '/examples/basics/formatting',
        },
        {
          title: 'Images',
          href: '/examples/basics/images',
        },
        {
          title: 'Long texts',
          href: '/examples/basics/long-texts',
        },
        {
          title: 'Markdown shortcuts',
          href: '/examples/basics/markdown-shortcuts',
        },
        {
          title: 'Minimal setup',
          href: '/examples/basics/minimal-setup',
        },
        {
          title: 'Tables',
          href: '/examples/basics/tables',
        },
        {
          title: 'Tasks',
          href: '/examples/basics/tasks',
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
          href: '/examples/advanced/clever-editor',
        },
        {
          title: 'Collaborative editing',
          href: '/examples/advanced/collaborative-editing',
        },
        {
          title: 'Drawing',
          href: '/examples/advanced/drawing',
        },
        {
          title: 'Forced content structure',
          href: '/examples/advanced/forced-content-structure',
        },
        {
          title: 'Interactive React & Vue views',
          href: '/examples/advanced/interactive-react-and-vue-views',
        },
        {
          title: 'Retrieval-Augmented Generation (RAG)',
          href: '/examples/advanced/retrieval-augmented-generation-rag',
        },
        {
          title: 'React performance',
          href: '/examples/advanced/react-performance',
        },
        {
          title: 'Menus',
          href: '/examples/advanced/menus',
        },
        {
          title: 'Mentions',
          href: '/examples/advanced/mentions',
        },
        {
          title: 'Syntax highlighting',
          href: '/examples/advanced/syntax-highlighting',
        },
      ],
    },
    {
      type: 'group',
      href: '',
      title: 'Experiments',
      children: [
        {
          title: 'AI agent',
          href: '/examples/experiments/ai-agent',
        },
        {
          title: 'Collaborative fields',
          href: '/examples/experiments/collaborative-fields',
        },
        {
          title: 'Figure',
          href: '/examples/experiments/figure',
        },
        {
          title: 'Generic figure',
          href: '/examples/experiments/generic-figure',
        },
        {
          title: 'iFrame',
          href: '/examples/experiments/iframe',
        },
        {
          title: 'Linting',
          href: '/examples/experiments/linting',
        },
        {
          title: 'Slash commands',
          href: '/examples/experiments/slash-commands',
        },
      ],
    },
  ],
}
