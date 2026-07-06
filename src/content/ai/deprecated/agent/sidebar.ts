import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ai-assistant',
  rootHref: '/content-ai/capabilities/agent/overview',
  title: 'AI Assistant (Legacy)',
  items: [
    {
      type: 'link',
      title: '← Back to Content AI',
      href: '/content-ai/getting-started/overview',
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/agent/overview',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/content-ai/capabilities/agent/overview',
        },
        {
          title: 'Install',
          href: '/content-ai/capabilities/agent/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/agent/use-with-content-ai-cloud',
      title: 'Integration',
      children: [
        {
          title: 'Use with Tiptap Cloud',
          href: '/content-ai/capabilities/agent/use-with-content-ai-cloud',
        },
        {
          title: 'Use with your AI agent',
          href: '/content-ai/capabilities/agent/custom-llms',
          children: [
            {
              title: 'Overview',
              href: '/content-ai/capabilities/agent/custom-llms/overview',
            },
            {
              title: 'Get started',
              href: '/content-ai/capabilities/agent/custom-llms/get-started',
              children: [
                {
                  title: 'Vercel AI SDK',
                  href: '/content-ai/capabilities/agent/custom-llms/get-started/vercel-ai-sdk',
                },
                {
                  title: 'OpenAI Completions',
                  href: '/content-ai/capabilities/agent/custom-llms/get-started/openai-chat-completions',
                },
                {
                  title: 'OpenAI Responses',
                  href: '/content-ai/capabilities/agent/custom-llms/get-started/openai-responses',
                },
                {
                  title: 'Anthropic Claude',
                  href: '/content-ai/capabilities/agent/custom-llms/get-started/anthropic-messages',
                },
              ],
            },
            {
              title: 'Tools overview',
              href: '/content-ai/capabilities/agent/custom-llms/tools',
            },
            {
              title: 'Client-side tools',
              href: '/content-ai/capabilities/agent/custom-llms/client-side-tools',
            },
            {
              title: 'Server-side tools',
              href: '/content-ai/capabilities/agent/custom-llms/server-side-tools',
              children: [
                {
                  title: 'Vercel AI SDK',
                  href: '/content-ai/capabilities/agent/custom-llms/server-side-tools/vercel-ai-sdk',
                },
                {
                  title: 'OpenAI Completions',
                  href: '/content-ai/capabilities/agent/custom-llms/server-side-tools/openai-chat-completions',
                },
                {
                  title: 'OpenAI Responses',
                  href: '/content-ai/capabilities/agent/custom-llms/server-side-tools/openai-responses',
                },
                {
                  title: 'Anthropic Claude',
                  href: '/content-ai/capabilities/agent/custom-llms/server-side-tools/anthropic-messages',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/agent/features/state',
      title: 'Features',
      children: [
        {
          title: 'State',
          href: '/content-ai/capabilities/agent/features/state',
        },
        {
          title: 'Events',
          href: '/content-ai/capabilities/agent/features/events',
        },
        {
          title: 'Methods',
          href: '/content-ai/capabilities/agent/features/methods',
        },
        {
          title: 'Lifecycle',
          href: '/content-ai/capabilities/agent/features/lifecycle',
        },
        {
          title: 'Checkpoints',
          href: '/content-ai/capabilities/agent/features/checkpoints',
        },
        {
          title: 'Provide context',
          href: '/content-ai/capabilities/agent/features/context',
        },
        {
          title: 'Selection awareness',
          href: '/content-ai/capabilities/agent/features/selection-awareness',
        },
        {
          title: 'Read large documents',
          href: '/content-ai/capabilities/agent/features/large-documents',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/agent/configure/options',
      title: 'Configuration',
      children: [
        {
          title: 'Configuration options',
          href: '/content-ai/capabilities/agent/configure/options',
        },
        {
          title: 'System prompt',
          href: '/content-ai/capabilities/agent/configure/system-prompt',
        },
        {
          title: 'Custom nodes/marks',
          href: '/content-ai/capabilities/agent/configure/custom-nodes',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/agent/review',
      title: 'Review changes',
      children: [
        {
          title: 'With AI Changes',
          href: '/content-ai/capabilities/agent/review/ai-changes',
        },
        {
          title: 'With AI Suggestion',
          href: '/content-ai/capabilities/agent/review/ai-suggestion',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities/agent/api-reference',
      title: 'Reference',
      children: [
        {
          title: 'API Reference',
          href: '/content-ai/capabilities/agent/api-reference',
        },
        {
          title: 'Changelog',
          href: '/content-ai/capabilities/agent/changelog',
        },
      ],
    },
  ],
}
