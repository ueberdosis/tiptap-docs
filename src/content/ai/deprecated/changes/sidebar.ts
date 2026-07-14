import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ai-changes',
  rootHref: '/ai/deprecated/changes/overview',
  title: 'AI Changes (Legacy)',
  items: [
    {
      type: 'link',
      title: '← Back to Content AI',
      href: '/ai/ai-toolkit/overview',
    },
    {
      type: 'group',
      href: '/ai/deprecated/changes/overview',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/ai/deprecated/changes/overview',
        },
        {
          title: 'Install',
          href: '/ai/deprecated/changes/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/changes/features/review-changes',
      title: 'Features',
      children: [
        {
          title: 'Review changes',
          href: '/ai/deprecated/changes/features/review-changes',
        },
        {
          title: 'Display changes',
          href: '/ai/deprecated/changes/features/display-changes',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/changes/configure',
      title: 'Reference',
      children: [
        {
          title: 'Configure',
          href: '/ai/deprecated/changes/configure',
        },
        {
          title: 'API Reference',
          href: '/ai/deprecated/changes/api-reference',
        },
        {
          title: 'Changelog',
          href: '/ai/deprecated/changes/changelog',
        },
      ],
    },
  ],
}
