import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'content-ai',
  rootHref: '/content-ai/getting-started/overview',
  title: 'Content AI',
  items: [
    {
      href: '/content-ai/getting-started/overview',
      title: 'Get started',
      type: 'group',
      children: [
        {
          title: 'Overview',
          href: '/content-ai/getting-started/overview',
        },
      ],
    },
    {
      type: 'group',
      href: '',
      title: 'Capabilities',
      children: [
        {
          title: 'Generate content',
          isActive: false,
          href: '/content-ai/capabilities/generation/overview',
        },
        {
          title: 'Autocomplete',
          isActive: false,
          href: '/content-ai/capabilities/generation/text-generation/autocompletion',
        },
        {
          title: 'Suggest content',
          isActive: false,
          href: '/content-ai/capabilities/suggestion/overview',
        },
        {
          title: 'Review changes',
          isActive: false,
          href: '/content-ai/capabilities/changes/overview',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/custom-llms',
      title: 'Bring your own AI',
      children: [
        {
          title: 'Integrate a custom LLM',
          href: '/content-ai/custom-llms',
        },
        {
          title: 'Integrate a custom agent',
          isActive: false,
          href: '/content-ai/capabilities/agent/overview',
          tags: ['New'],
        },
        {
          title: 'Text editing tools',
          href: '/content-ai/tools-for-ai-agents/text-editing-tools',
          tags: ['New'],
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities',
      title: 'AI Extensions',
      children: [
        {
          title: 'AI Generation',
          tags: ['Start'],
          href: '/content-ai/capabilities/generation/',
          children: [
            {
              title: 'Overview',
              href: '/content-ai/capabilities/generation/overview',
            },
            {
              title: 'Install',
              href: '/content-ai/capabilities/generation/install',
            },
            {
              title: 'Text generation',
              href: '/content-ai/capabilities/generation/text-generation',
              children: [
                {
                  title: 'Built-in commands',
                  href: '/content-ai/capabilities/generation/text-generation/built-in-commands',
                },
                {
                  title: 'Autocompletion',
                  href: '/content-ai/capabilities/generation/text-generation/autocompletion',
                },
                {
                  title: 'Provide context',
                  href: '/content-ai/capabilities/generation/text-generation/provide-context',
                },
                {
                  title: 'Formatted responses',
                  href: '/content-ai/capabilities/generation/text-generation/format',
                },
                {
                  title: 'Manage responses',
                  href: '/content-ai/capabilities/generation/text-generation/manage-responses',
                },
                {
                  title: 'Custom commands',
                  href: '/content-ai/capabilities/generation/text-generation/custom-commands',
                },
                {
                  title: 'Stream content (Advanced)',
                  href: '/content-ai/capabilities/generation/text-generation/stream',
                },
              ],
            },
            {
              title: 'Image generation',
              href: '/content-ai/capabilities/generation/image-generation',
            },
            {
              title: 'Integrate your LLM',
              href: '/content-ai/capabilities/generation/custom-llms',
            },
            {
              title: 'Configure',
              href: '/content-ai/capabilities/generation/configure',
            },
          ],
        },
        {
          title: 'AI Suggestion',
          href: '/content-ai/capabilities/suggestion',
          tags: ['Team'],
          beta: true,
          children: [
            {
              title: 'Overview',
              href: '/content-ai/capabilities/suggestion/overview',
            },
            {
              title: 'Install',
              href: '/content-ai/capabilities/suggestion/install',
            },
            {
              title: 'Features',
              href: '/content-ai/capabilities/suggestion/features',
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
        {
          title: 'AI Changes',
          href: '/content-ai/capabilities/changes',
          tags: ['Team'],
          beta: true,
          children: [
            {
              title: 'Overview',
              href: '/content-ai/capabilities/changes/overview',
            },
            {
              title: 'Install',
              href: '/content-ai/capabilities/changes/install',
            },
            {
              title: 'Features',
              href: '/content-ai/capabilities/changes/features',
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
        {
          title: 'AI Agent',
          href: '/content-ai/capabilities/agent',
          tags: ['Team'],
          beta: true,
          children: [
            {
              title: 'Overview',
              href: '/content-ai/capabilities/agent/overview',
            },
            {
              title: 'Install',
              href: '/content-ai/capabilities/agent/install',
            },
            {
              title: 'Use with Tiptap Cloud',
              href: '/content-ai/capabilities/agent/use-with-content-ai-cloud',
            },
            {
              title: 'Use with your AI Agent',
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
            {
              title: 'Features',
              href: '/content-ai/capabilities/agent/features',
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
              title: 'Configure',
              href: '/content-ai/capabilities/agent/configure',
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
              title: 'Review changes',
              href: '/content-ai/capabilities/agent/review',
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
    },
    {
      type: 'group',
      href: '/content-ai/resources',
      title: 'Resources',
      children: [
        {
          title: 'Privacy',
          href: '/content-ai/resources/privacy',
        },
        {
          title: 'Collaboration',
          href: '/content-ai/resources/collaboration',
        },
      ],
    },
  ],
}
