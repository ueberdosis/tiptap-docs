import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ai-suggestion',
  rootHref: '/content-ai/capabilities/suggestion/overview',
  title: 'AI Suggestion (Legacy)',
  items: [
    {
      type: 'link',
      title: '← Back to Content AI',
      href: '/content-ai/getting-started/overview',
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/suggestion/overview',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/content-ai/capabilities/suggestion/overview',
        },
        {
          title: 'Install',
          href: '/content-ai/capabilities/suggestion/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/suggestion/features/define-rules',
      title: 'Features',
      children: [
        {
          title: 'Define rules',
          href: '/content-ai/capabilities/suggestion/features/define-rules',
        },
        {
          title: 'Configure when to load suggestions',
          href: '/content-ai/capabilities/suggestion/features/configure-when-to-load-suggestions',
        },
        {
          title: 'Display suggestions',
          href: '/content-ai/capabilities/suggestion/features/display-suggestions',
        },
        {
          title: 'Apply and reject suggestions',
          href: '/content-ai/capabilities/suggestion/features/apply-suggestions',
        },
        {
          title: 'Lock content',
          href: '/content-ai/capabilities/suggestion/features/lock-content',
        },
        {
          title: 'Provide LLM context',
          href: '/content-ai/capabilities/suggestion/features/provide-llm-context',
        },
        {
          title: 'Diff view',
          href: '/content-ai/capabilities/suggestion/features/diff-view',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/suggestion/use-with-content-ai-cloud',
      title: 'Integration',
      children: [
        {
          title: 'Use with Content AI Cloud',
          href: '/content-ai/capabilities/suggestion/use-with-content-ai-cloud',
        },
        {
          title: 'Integrate your LLM',
          href: '/content-ai/capabilities/suggestion/custom-llms',
        },
        {
          title: 'Configure',
          href: '/content-ai/capabilities/suggestion/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/suggestion/api-reference',
      title: 'Reference',
      children: [
        {
          title: 'API Reference',
          href: '/content-ai/capabilities/suggestion/api-reference',
        },
        {
          title: 'Changelog',
          href: '/content-ai/capabilities/suggestion/changelog',
        },
      ],
    },
  ],
}
