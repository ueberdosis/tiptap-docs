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
        {
          title: 'Use cases',
          href: '/content-ai/capabilities/use-cases',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities',
      title: 'AI Extensions',
      children: [
        {
          title: 'AI Toolkit',
          href: '/content-ai/capabilities/ai-toolkit',
          tags: ['Add-on'],
          beta: true,
          children: [
            {
              title: 'Overview',
              href: '/content-ai/capabilities/ai-toolkit/overview',
            },
            {
              title: 'Install',
              href: '/content-ai/capabilities/ai-toolkit/install',
            },
            {
              title: 'Agents',
              href: '/content-ai/capabilities/ai-toolkit/agents',
              children: [
                {
                  title: 'AI agent chatbot',
                  href: '/content-ai/capabilities/ai-toolkit/agents/ai-agent-chatbot',
                },
                {
                  title: 'Review changes',
                  href: '/content-ai/capabilities/ai-toolkit/agents/review-changes',
                },
                {
                  title: 'Review as summary',
                  href: '/content-ai/capabilities/ai-toolkit/agents/review-changes-as-summary',
                },
                {
                  title: 'Tool streaming',
                  href: '/content-ai/capabilities/ai-toolkit/agents/tool-streaming',
                },
                {
                  title: 'Add comments',
                  href: '/content-ai/capabilities/ai-toolkit/agents/comments',
                },
                {
                  title: 'Multi-document',
                  href: '/content-ai/capabilities/ai-toolkit/agents/multi-document',
                },
                {
                  title: 'Selection awareness',
                  href: '/content-ai/capabilities/ai-toolkit/agents/selection-awareness',
                },
                {
                  title: 'Schema awareness',
                  href: '/content-ai/capabilities/ai-toolkit/agents/schema-awareness',
                },
                {
                  title: 'Tool definitions',
                  href: '/content-ai/capabilities/ai-toolkit/agents/tools',
                  children: [
                    {
                      title: 'Vercel AI SDK',
                      href: '/content-ai/capabilities/ai-toolkit/agents/tools/ai-sdk',
                    },
                    {
                      title: 'LangChain.js',
                      href: '/content-ai/capabilities/ai-toolkit/agents/tools/langchain-js',
                    },
                    {
                      title: 'OpenAI',
                      href: '/content-ai/capabilities/ai-toolkit/agents/tools/openai',
                    },
                    {
                      title: 'Anthropic',
                      href: '/content-ai/capabilities/ai-toolkit/agents/tools/anthropic',
                    },
                    {
                      title: 'Mastra',
                      href: '/content-ai/capabilities/ai-toolkit/agents/tools/mastra',
                    },
                    {
                      title: 'Other providers',
                      href: '/content-ai/capabilities/ai-toolkit/agents/tools/other-providers',
                    },
                  ],
                },
              ],
            },
            {
              title: 'Workflows',
              href: '/content-ai/capabilities/ai-toolkit/workflows',
              children: [
                {
                  title: 'Insert content',
                  href: '/content-ai/capabilities/ai-toolkit/workflows/insert-content',
                },
                {
                  title: 'Proofreader',
                  href: '/content-ai/capabilities/ai-toolkit/workflows/proofreader',
                },
                {
                  title: 'Tiptap Edit',
                  href: '/content-ai/capabilities/ai-toolkit/workflows/tiptap-edit',
                },
                {
                  title: 'Comments',
                  href: '/content-ai/capabilities/ai-toolkit/workflows/comments',
                },
              ],
            },
            {
              title: 'Advanced guides',
              href: '/content-ai/capabilities/ai-toolkit/advanced-guides',
              children: [
                {
                  title: 'Live demo',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/live-demo',
                },
                {
                  title: 'AI engineering guide',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/ai-engineering',
                },
                {
                  title: 'Style suggestions',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/style-suggestions',
                },
                {
                  title: 'Compare documents',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/compare-documents',
                },
                {
                  title: 'Migration guides',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/migration-guides',
                  children: [
                    {
                      title: 'AI Generation',
                      href: '/content-ai/capabilities/ai-toolkit/advanced-guides/migration-guides/ai-generation',
                    },
                    {
                      title: 'AI Suggestion',
                      href: '/content-ai/capabilities/ai-toolkit/advanced-guides/migration-guides/ai-suggestion',
                    },
                    {
                      title: 'AI Changes',
                      href: '/content-ai/capabilities/ai-toolkit/advanced-guides/migration-guides/ai-changes',
                    },
                    {
                      title: 'AI Assistant',
                      href: '/content-ai/capabilities/ai-toolkit/advanced-guides/migration-guides/ai-assistant',
                    },
                  ],
                },
              ],
            },
            {
              title: 'API reference',
              href: '/content-ai/capabilities/ai-toolkit/api-reference',
              children: [
                {
                  title: 'Read the document',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/read-the-document',
                },
                {
                  title: 'Edit the document',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/edit-the-document',
                },
                {
                  title: 'Tool execution',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/execute-tool',
                },
                {
                  title: 'Workflows',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/workflows',
                },
                {
                  title: 'Schema awareness',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/schema-awareness',
                },
                {
                  title: 'Display suggestions',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/display-suggestions',
                },
                {
                  title: 'Compare documents',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/compare-documents',
                },
                {
                  title: 'Diff utility',
                  href: '/content-ai/capabilities/ai-toolkit/api-reference/diff-utility',
                },
              ],
            },
            {
              title: 'Changelog',
              href: '/content-ai/capabilities/ai-toolkit/changelog',
              children: [
                {
                  title: 'AI Toolkit',
                  href: '/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit',
                },
                {
                  title: 'AI SDK tools',
                  href: '/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit-ai-sdk',
                },
                {
                  title: 'LangChain.js tools',
                  href: '/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit-langchain',
                },
                {
                  title: 'OpenAI tools',
                  href: '/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit-openai',
                },
                {
                  title: 'Anthropic tools',
                  href: '/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit-anthropic',
                },
                {
                  title: 'Tool definitions',
                  href: '/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit-tool-definitions',
                },
              ],
            },
          ],
        },
        {
          title: 'Server AI Toolkit',
          href: '/content-ai/capabilities/server-ai-toolkit',
          tags: ['Alpha'],
          children: [
            {
              title: 'Overview',
              href: '/content-ai/capabilities/server-ai-toolkit/overview',
            },
            {
              title: 'Install',
              href: '/content-ai/capabilities/server-ai-toolkit/install',
            },
            {
              title: 'Agents',
              href: '/content-ai/capabilities/server-ai-toolkit/agents',
              children: [
                {
                  title: 'AI agent chatbot',
                  href: '/content-ai/capabilities/server-ai-toolkit/agents/ai-agent-chatbot',
                },
                {
                  title: 'Schema awareness',
                  href: '/content-ai/capabilities/server-ai-toolkit/agents/schema-awareness',
                },
                {
                  title: 'Tool definitions',
                  href: '/content-ai/capabilities/server-ai-toolkit/agents/tools',
                },
              ],
            },
            {
              title: 'Workflows',
              href: '/content-ai/capabilities/server-ai-toolkit/workflows',
            },
            {
              title: 'API reference',
              href: '/content-ai/capabilities/server-ai-toolkit/api-reference',
              children: [
                {
                  title: 'Schema awareness',
                  href: '/content-ai/capabilities/server-ai-toolkit/api-reference/schema-awareness',
                },
                {
                  title: 'REST API',
                  href: '/content-ai/capabilities/server-ai-toolkit/api-reference/rest-api',
                },
              ],
            },
            {
              title: 'Changelog',
              href: '/content-ai/capabilities/server-ai-toolkit/changelog',
              children: [
                {
                  title: 'Server AI Toolkit',
                  href: '/content-ai/capabilities/server-ai-toolkit/changelog/server-ai-toolkit',
                },
              ],
            },
          ],
        },
        {
          title: 'AI Generation',
          tags: ['Start'],
          href: '/content-ai/capabilities/generation',
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
      ],
    },
  ],
}
