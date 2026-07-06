import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ai-suggestion',
  rootHref: '/ai/deprecated/suggestion/overview',
  title: 'AI Suggestion (Legacy)',
  items: [
    {
      type: 'link',
      title: '← Back to Content AI',
      href: '/ai/getting-started/overview',
    },
    {
      type: 'group',
      href: '/ai/deprecated/suggestion/overview',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/ai/deprecated/suggestion/overview',
        },
        {
          title: 'Install',
          href: '/ai/deprecated/suggestion/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/suggestion/features/define-rules',
      title: 'Features',
      children: [
        {
          title: 'Define rules',
          href: '/ai/deprecated/suggestion/features/define-rules',
        },
        {
          title: 'Configure when to load suggestions',
          href: '/ai/deprecated/suggestion/features/configure-when-to-load-suggestions',
        },
        {
          title: 'Display suggestions',
          href: '/ai/deprecated/suggestion/features/display-suggestions',
        },
        {
          title: 'Apply and reject suggestions',
          href: '/ai/deprecated/suggestion/features/apply-suggestions',
        },
        {
          title: 'Lock content',
          href: '/ai/deprecated/suggestion/features/lock-content',
        },
        {
          title: 'Provide LLM context',
          href: '/ai/deprecated/suggestion/features/provide-llm-context',
        },
        {
          title: 'Diff view',
          href: '/ai/deprecated/suggestion/features/diff-view',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/suggestion/use-with-content-ai-cloud',
      title: 'Integration',
      children: [
        {
          title: 'Use with Content AI Cloud',
          href: '/ai/deprecated/suggestion/use-with-content-ai-cloud',
        },
        {
          title: 'Integrate your LLM',
          href: '/ai/deprecated/suggestion/custom-llms',
        },
        {
          title: 'Configure',
          href: '/ai/deprecated/suggestion/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/suggestion/api-reference',
      title: 'Reference',
      children: [
        {
          title: 'API Reference',
          href: '/ai/deprecated/suggestion/api-reference',
        },
        {
          title: 'Changelog',
          href: '/ai/deprecated/suggestion/changelog',
        },
      ],
    },
  ],
}
