import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'pages-v2',
  rootHref: '/pages/v2/getting-started/overview',
  title: 'Pages',
  items: [
    {
      type: 'group',
      href: '/pages/v2/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/pages/v2/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/pages/v2/getting-started/install',
        },
        {
          title: 'React',
          href: '/pages/v2/getting-started/react',
        },
        {
          title: 'Toolbar',
          href: '/pages/v2/getting-started/toolbar',
        },
        {
          title: 'Components',
          href: '/pages/v2/getting-started/components',
        },
        {
          title: 'Live demo',
          href: '/pages/v2/getting-started/live-demo',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/v2/core-concepts',
      title: 'Core concepts',
      children: [
        {
          title: 'Page format',
          href: '/pages/v2/core-concepts/page-format',
        },
        {
          title: 'Breaks',
          href: '/pages/v2/core-concepts/breaks',
        },
        {
          title: 'Sections',
          href: '/pages/v2/core-concepts/sections',
        },
        {
          title: 'Section columns',
          href: '/pages/v2/core-concepts/section-columns',
        },
        {
          title: 'Header and footer',
          href: '/pages/v2/core-concepts/header-and-footer',
        },
        {
          title: 'Page numbers',
          href: '/pages/v2/core-concepts/page-numbers',
        },
        {
          title: 'Page colors',
          href: '/pages/v2/core-concepts/page-colors',
        },
        {
          title: 'Zoom',
          href: '/pages/v2/core-concepts/zoom',
        },
        {
          title: 'Styling',
          href: '/pages/v2/core-concepts/styling',
        },
        {
          title: 'Positions and events',
          href: '/pages/v2/core-concepts/positions-and-events',
        },
        {
          title: 'Limitations',
          href: '/pages/v2/core-concepts/limitations',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/v2/api',
      title: 'API',
      children: [
        {
          title: 'Options',
          href: '/pages/v2/api/options',
        },
        {
          title: 'Commands',
          href: '/pages/v2/api/commands',
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/v2/extensions',
      title: 'Extensions',
      children: [
        {
          title: 'Overview',
          href: '/pages/v2/extensions/overview',
        },
        {
          title: 'Tables',
          href: '/pages/v2/extensions/tables',
        },
        {
          title: 'Column layout',
          href: '/pages/v2/extensions/columns',
        },
        {
          title: 'Footnotes',
          href: '/pages/v2/extensions/footnotes',
        },
        {
          title: 'Outline numbering',
          href: '/pages/v2/extensions/outline-numbering',
        },
        {
          title: 'Number formats',
          href: '/pages/v2/extensions/number-formats',
        },
        {
          title: 'Whole blocks',
          href: '/pages/v2/extensions/whole-blocks',
        },
        {
          title: 'Cross-references',
          href: '/pages/v2/extensions/cross-references',
          children: [
            {
              title: 'Sources',
              href: '/pages/v2/extensions/cross-references/sources',
            },
            {
              title: 'What a reference shows',
              href: '/pages/v2/extensions/cross-references/displays',
            },
            {
              title: 'Several targets',
              href: '/pages/v2/extensions/cross-references/joins',
            },
            {
              title: 'Commands',
              href: '/pages/v2/extensions/cross-references/commands',
            },
            {
              title: 'Word fields',
              href: '/pages/v2/extensions/cross-references/docx',
            },
          ],
        },
        {
          title: 'Bookmarks',
          href: '/pages/v2/extensions/bookmarks',
          children: [
            {
              title: 'Commands',
              href: '/pages/v2/extensions/bookmarks/commands',
            },
          ],
        },
        {
          title: 'Document styles',
          href: '/pages/v2/extensions/document-styles',
          children: [
            {
              title: 'Definitions',
              href: '/pages/v2/extensions/document-styles/definitions',
            },
            {
              title: 'Apply styles',
              href: '/pages/v2/extensions/document-styles/applying',
            },
            {
              title: 'Colors and fonts',
              href: '/pages/v2/extensions/document-styles/values',
            },
            {
              title: 'Themes',
              href: '/pages/v2/extensions/document-styles/themes',
            },
            {
              title: 'Table styles',
              href: '/pages/v2/extensions/document-styles/tables',
            },
            {
              title: 'Libraries',
              href: '/pages/v2/extensions/document-styles/libraries',
            },
            {
              title: 'Clean up',
              href: '/pages/v2/extensions/document-styles/cleanup',
            },
            {
              title: 'At a glance',
              href: '/pages/v2/extensions/document-styles/api',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/pages/v2/guides',
      title: 'Guides',
      children: [],
    },
  ],
}
