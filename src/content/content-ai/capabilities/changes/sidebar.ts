import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ai-changes',
  rootHref: '/content-ai/capabilities/changes/overview',
  title: 'AI Changes (Legacy)',
  items: [
    {
      type: 'link',
      title: '← Back to Content AI',
      href: '/content-ai/getting-started/overview',
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/changes/overview',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/content-ai/capabilities/changes/overview',
        },
        {
          title: 'Install',
          href: '/content-ai/capabilities/changes/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/changes/features/review-changes',
      title: 'Features',
      children: [
        {
          title: 'Review changes',
          href: '/content-ai/capabilities/changes/features/review-changes',
        },
        {
          title: 'Display changes',
          href: '/content-ai/capabilities/changes/features/display-changes',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/changes/configure',
      title: 'Reference',
      children: [
        {
          title: 'Configure',
          href: '/content-ai/capabilities/changes/configure',
        },
        {
          title: 'API Reference',
          href: '/content-ai/capabilities/changes/api-reference',
        },
        {
          title: 'Changelog',
          href: '/content-ai/capabilities/changes/changelog',
        },
      ],
    },
  ],
}
