import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ai-assistant',
  rootHref: '/ai/deprecated/agent/overview',
  title: 'AI Assistant (Legacy)',
  items: [
    {
      type: 'link',
      title: '← Back to Content AI',
      href: '/content-ai/getting-started/overview',
    },
    {
      type: 'group',
      href: '/ai/deprecated/agent/overview',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/ai/deprecated/agent/overview',
        },
        {
          title: 'Install',
          href: '/ai/deprecated/agent/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/agent/use-with-content-ai-cloud',
      title: 'Integration',
      children: [
        {
          title: 'Use with Tiptap Cloud',
          href: '/ai/deprecated/agent/use-with-content-ai-cloud',
        },
        {
          title: 'Use with your AI agent',
          href: '/ai/deprecated/agent/custom-llms',
          children: [
            {
              title: 'Overview',
              href: '/ai/deprecated/agent/custom-llms/overview',
            },
            {
              title: 'Get started',
              href: '/ai/deprecated/agent/custom-llms/get-started',
              children: [
                {
                  title: 'Vercel AI SDK',
                  href: '/ai/deprecated/agent/custom-llms/get-started/vercel-ai-sdk',
                },
                {
                  title: 'OpenAI Completions',
                  href: '/ai/deprecated/agent/custom-llms/get-started/openai-chat-completions',
                },
                {
                  title: 'OpenAI Responses',
                  href: '/ai/deprecated/agent/custom-llms/get-started/openai-responses',
                },
                {
                  title: 'Anthropic Claude',
                  href: '/ai/deprecated/agent/custom-llms/get-started/anthropic-messages',
                },
              ],
            },
            {
              title: 'Tools overview',
              href: '/ai/deprecated/agent/custom-llms/tools',
            },
            {
              title: 'Client-side tools',
              href: '/ai/deprecated/agent/custom-llms/client-side-tools',
            },
            {
              title: 'Server-side tools',
              href: '/ai/deprecated/agent/custom-llms/server-side-tools',
              children: [
                {
                  title: 'Vercel AI SDK',
                  href: '/ai/deprecated/agent/custom-llms/server-side-tools/vercel-ai-sdk',
                },
                {
                  title: 'OpenAI Completions',
                  href: '/ai/deprecated/agent/custom-llms/server-side-tools/openai-chat-completions',
                },
                {
                  title: 'OpenAI Responses',
                  href: '/ai/deprecated/agent/custom-llms/server-side-tools/openai-responses',
                },
                {
                  title: 'Anthropic Claude',
                  href: '/ai/deprecated/agent/custom-llms/server-side-tools/anthropic-messages',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/agent/features/state',
      title: 'Features',
      children: [
        {
          title: 'State',
          href: '/ai/deprecated/agent/features/state',
        },
        {
          title: 'Events',
          href: '/ai/deprecated/agent/features/events',
        },
        {
          title: 'Methods',
          href: '/ai/deprecated/agent/features/methods',
        },
        {
          title: 'Lifecycle',
          href: '/ai/deprecated/agent/features/lifecycle',
        },
        {
          title: 'Checkpoints',
          href: '/ai/deprecated/agent/features/checkpoints',
        },
        {
          title: 'Provide context',
          href: '/ai/deprecated/agent/features/context',
        },
        {
          title: 'Selection awareness',
          href: '/ai/deprecated/agent/features/selection-awareness',
        },
        {
          title: 'Read large documents',
          href: '/ai/deprecated/agent/features/large-documents',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/agent/configure/options',
      title: 'Configuration',
      children: [
        {
          title: 'Configuration options',
          href: '/ai/deprecated/agent/configure/options',
        },
        {
          title: 'System prompt',
          href: '/ai/deprecated/agent/configure/system-prompt',
        },
        {
          title: 'Custom nodes/marks',
          href: '/ai/deprecated/agent/configure/custom-nodes',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/agent/review',
      title: 'Review changes',
      children: [
        {
          title: 'With AI Changes',
          href: '/ai/deprecated/agent/review/ai-changes',
        },
        {
          title: 'With AI Suggestion',
          href: '/ai/deprecated/agent/review/ai-suggestion',
        },
      ],
    },
    {
      type: 'group',
      href: '/ai/deprecated/agent/api-reference',
      title: 'Reference',
      children: [
        {
          title: 'API Reference',
          href: '/ai/deprecated/agent/api-reference',
        },
        {
          title: 'Changelog',
          href: '/ai/deprecated/agent/changelog',
        },
      ],
    },
  ],
}
