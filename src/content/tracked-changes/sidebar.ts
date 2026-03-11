import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'tracked-changes',
  rootHref: '/tracked-changes/getting-started/overview',
  title: 'Tracked Changes',
  items: [
    {
      type: 'group',
      href: '/tracked-changes/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/tracked-changes/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/tracked-changes/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/tracked-changes/usage',
      title: 'Usage',
      children: [
        {
          title: 'Basic usage',
          href: '/tracked-changes/usage/basic-usage',
        },
        {
          title: 'Advanced usage',
          href: '/tracked-changes/usage/advanced-usage',
        },
      ],
    },
    {
      type: 'group',
      href: '/tracked-changes/guides',
      title: 'Guides',
      children: [
        {
          title: 'Creating an editor',
          href: '/tracked-changes/guides/editor-setup',
        },
        {
          title: 'Build a suggestion list',
          href: '/tracked-changes/guides/suggestion-list',
        },
        {
          title: 'Tracked Changes with Comments',
          href: '/tracked-changes/guides/comments-integration',
        },
      ],
    },
    {
      type: 'group',
      href: '/tracked-changes/examples',
      title: 'Examples',
      children: [
        {
          title: 'Simple Tracked Changes',
          href: '/tracked-changes/examples/simple',
        },
        {
          title: 'With Collaboration',
          href: '/tracked-changes/examples/collaboration',
        },
        {
          title: 'With Comments',
          href: '/tracked-changes/examples/comments',
        },
      ],
    },
    {
      type: 'group',
      href: '/tracked-changes/api-reference',
      title: 'API Reference',
      children: [
        {
          title: 'Commands',
          href: '/tracked-changes/api-reference/commands',
        },
        {
          title: 'Events',
          href: '/tracked-changes/api-reference/events',
        },
        {
          title: 'Utilities',
          href: '/tracked-changes/api-reference/utilities',
        },
        {
          title: 'Types',
          href: '/tracked-changes/api-reference/types',
        },
        {
          title: 'Styling',
          href: '/tracked-changes/api-reference/styling',
        },
      ],
    },
  ],
}
