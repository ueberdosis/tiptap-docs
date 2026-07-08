import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'ai',
  rootHref: '/ai/ai-toolkit/overview',
  title: 'AI Toolkit',
  items: [
    {
      href: '/ai/ai-toolkit/getting-started/overview',
      title: 'AI Toolkit',
      type: 'group',
      tags: ['Add-on'],
      children: [
        {
          title: 'Overview',
          releaseTag: 'beta',
          href: '/ai/ai-toolkit/overview',
        },
        {
          title: 'Install',
          href: '/ai/ai-toolkit/install',
        },
        {
          title: 'Agents',
          href: '/ai/ai-toolkit/agents',
          children: [
            {
              title: 'AI agent chatbot',
              href: '/ai/ai-toolkit/agents/ai-agent-chatbot',
            },
            {
              title: 'With Tracked Changes',
              href: '/ai/ai-toolkit/agents/tracked-changes',
            },
            {
              title: 'Comments',
              href: '/ai/ai-toolkit/agents/comments',
            },
            {
              title: 'Streaming',
              href: '/ai/ai-toolkit/agents/streaming',
              releaseTag: 'alpha',
            },
          ],
        },
        {
          title: 'API reference',
          href: '/ai/ai-toolkit/api-reference',
          children: [
            {
              title: 'REST API',
              href: '/ai/ai-toolkit/api-reference/rest-api',
            },
            {
              title: 'Editor context',
              href: '/ai/ai-toolkit/api-reference/editor-context',
            },
            {
              title: 'Review options',
              href: '/ai/ai-toolkit/api-reference/review-options',
            },
            {
              title: 'REST API (legacy v3)',
              href: '/ai/ai-toolkit/api-reference/rest-api-v3',
            },
          ],
        },
        {
          title: 'Advanced guides',
          href: '/ai/ai-toolkit/advanced-guides',
          children: [
            {
              title: 'Custom nodes',
              href: '/ai/ai-toolkit/advanced-guides/custom-nodes',
            },
            {
              title: 'Tiptap Shorthand',
              href: '/ai/ai-toolkit/advanced-guides/tiptap-shorthand',
              releaseTag: 'alpha',
            },
          ],
        },
        /*
        {
          title: 'Changelog',
          href: '/resources/changelog/server-ai-toolkit',
        },
        */
      ],
    },
    {
      type: 'group',
      // Not a real URL and as far as I can see doesn't need to be...
      href: '/ai/other-options',
      title: 'Other Options',
      children: [
        {
          title: 'Client toolkit',
          href: '/ai/ai-toolkit/client',
          tags: ['Add-on'],
          children: [
            {
              title: 'Overview',
              href: '/ai/ai-toolkit/client/overview',
            },
            {
              title: 'Use cases',
              href: '/ai/ai-toolkit/client/use-cases',
            },
            {
              title: 'Install',
              href: '/ai/ai-toolkit/client/install',
            },
            {
              title: 'Agents',
              href: '/ai/ai-toolkit/client/agents',
              children: [
                {
                  title: 'AI agent chatbot',
                  href: '/ai/ai-toolkit/client/agents/ai-agent-chatbot',
                },
                {
                  title: 'Review changes',
                  href: '/ai/ai-toolkit/client/agents/review-changes',
                  children: [
                    {
                      title: 'With Tracked Changes',
                      href: '/ai/ai-toolkit/client/agents/review-changes/tracked-changes',
                    },
                    {
                      title: 'Tracked changes with comments',
                      href: '/ai/ai-toolkit/client/agents/review-changes/tracked-changes-with-comments',
                    },
                    {
                      title: 'Suggestions',
                      href: '/ai/ai-toolkit/client/agents/review-changes/suggestions',
                    },
                    {
                      title: 'Suggestions with comments',
                      href: '/ai/ai-toolkit/client/agents/review-changes/suggestions-with-comments',
                    },
                    {
                      title: 'Style suggestions',
                      href: '/ai/ai-toolkit/client/agents/review-changes/style-suggestions',
                    },
                  ],
                },
                {
                  title: 'Streaming',
                  href: '/ai/ai-toolkit/client/agents/streaming',
                },
                {
                  title: 'Comments',
                  href: '/ai/ai-toolkit/client/agents/comments',
                },
                {
                  title: 'Multi-document',
                  href: '/ai/ai-toolkit/client/agents/multi-document',
                },
                {
                  title: 'Selection awareness',
                  href: '/ai/ai-toolkit/client/agents/selection-awareness',
                },
                {
                  title: 'Schema awareness',
                  href: '/ai/ai-toolkit/client/agents/schema-awareness',
                },
                {
                  title: 'Tool definitions',
                  href: '/ai/ai-toolkit/client/agents/tools',
                  children: [
                    {
                      title: 'Vercel AI SDK',
                      href: '/ai/ai-toolkit/client/agents/tools/ai-sdk',
                    },
                    {
                      title: 'LangChain.js',
                      href: '/ai/ai-toolkit/client/agents/tools/langchain-js',
                    },
                    {
                      title: 'OpenAI',
                      href: '/ai/ai-toolkit/client/agents/tools/openai',
                    },
                    {
                      title: 'Anthropic',
                      href: '/ai/ai-toolkit/client/agents/tools/anthropic',
                    },
                    {
                      title: 'Mastra',
                      href: '/ai/ai-toolkit/client/agents/tools/mastra',
                    },
                    {
                      title: 'Other providers',
                      href: '/ai/ai-toolkit/client/agents/tools/other-providers',
                    },
                  ],
                },
              ],
            },
            {
              title: 'Workflows',
              href: '/ai/ai-toolkit/client/workflows',
              children: [
                {
                  title: 'Insert content',
                  href: '/ai/ai-toolkit/client/workflows/insert-content',
                },
                {
                  title: 'Proofreader',
                  href: '/ai/ai-toolkit/client/workflows/proofreader',
                },
                {
                  title: 'Tiptap Edit',
                  href: '/ai/ai-toolkit/client/workflows/tiptap-edit',
                },
                {
                  title: 'Comments',
                  href: '/ai/ai-toolkit/client/workflows/comments',
                },
                {
                  title: 'Template',
                  href: '/ai/ai-toolkit/client/workflows/template',
                },
              ],
            },
            {
              title: 'Advanced guides',
              href: '/ai/ai-toolkit/client/advanced-guides',
              children: [
                {
                  title: 'Live demo',
                  href: '/ai/ai-toolkit/client/advanced-guides/live-demo',
                },
                {
                  title: 'Concepts',
                  href: '/ai/ai-toolkit/client/advanced-guides/concepts',
                },
                {
                  title: 'AI engineering',
                  href: '/ai/ai-toolkit/client/advanced-guides/ai-engineering',
                },
                {
                  title: 'Compare documents',
                  href: '/ai/ai-toolkit/client/advanced-guides/compare-documents',
                },
                {
                  title: 'Split view',
                  href: '/ai/ai-toolkit/client/advanced-guides/split-view',
                },
                {
                  title: 'Tiptap Edit hooks',
                  href: '/ai/ai-toolkit/client/advanced-guides/tiptap-edit-hooks',
                },
                {
                  title: 'AI Caret',
                  href: '/ai/ai-toolkit/client/advanced-guides/ai-caret',
                },
                {
                  title: 'Non-TypeScript backends',
                  href: '/ai/ai-toolkit/client/advanced-guides/non-typescript-backends',
                },
                {
                  title: 'Migration guides',
                  href: '/ai/ai-toolkit/client/advanced-guides/migration-guides',
                  children: [
                    {
                      title: 'Basic AI Generation',
                      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides/ai-generation',
                    },
                    {
                      title: 'AI Suggestion',
                      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides/ai-suggestion',
                    },
                    {
                      title: 'AI Changes',
                      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides/ai-changes',
                    },
                    {
                      title: 'AI Assistant',
                      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides/ai-assistant',
                    },
                  ],
                },
              ],
            },
            {
              title: 'API reference',
              href: '/ai/ai-toolkit/client/api-reference',
              children: [
                {
                  title: 'Read the document',
                  href: '/ai/ai-toolkit/client/api-reference/read-the-document',
                },
                {
                  title: 'Edit the document',
                  href: '/ai/ai-toolkit/client/api-reference/edit-the-document',
                },
                {
                  title: 'Tool execution',
                  href: '/ai/ai-toolkit/client/api-reference/execute-tool',
                },
                {
                  title: 'Workflows',
                  href: '/ai/ai-toolkit/client/api-reference/workflows',
                },
                {
                  title: 'Schema awareness',
                  href: '/ai/ai-toolkit/client/api-reference/schema-awareness',
                },
                {
                  title: 'Review options',
                  href: '/ai/ai-toolkit/client/api-reference/review-options',
                },
                {
                  title: 'Suggestions',
                  href: '/ai/ai-toolkit/client/api-reference/suggestions',
                },
                {
                  title: 'Diff utility',
                  href: '/ai/ai-toolkit/client/api-reference/diff-utility',
                },
                {
                  title: 'Split view',
                  href: '/ai/ai-toolkit/client/api-reference/split-view',
                },
              ],
            },
            {
              title: 'Changelog',
              href: '/ai/ai-toolkit/client/changelog',
            },
          ],
        },
        {
          title: 'Basic AI Generation',
          tags: ['Start'],
          href: '/ai/basic',
          children: [
            {
              title: 'Overview',
              href: '/ai/basic/overview',
            },
            {
              title: 'Use cases',
              href: '/ai/basic/use-cases',
            },
            {
              title: 'Install',
              href: '/ai/basic/install',
            },
            {
              title: 'Text generation',
              href: '/ai/basic/text-generation',
              children: [
                {
                  title: 'Built-in commands',
                  href: '/ai/basic/text-generation/built-in-commands',
                },
                {
                  title: 'Autocompletion',
                  href: '/ai/basic/text-generation/autocompletion',
                },
                {
                  title: 'Provide context',
                  href: '/ai/basic/text-generation/provide-context',
                },
                {
                  title: 'Formatted responses',
                  href: '/ai/basic/text-generation/format',
                },
                {
                  title: 'Manage responses',
                  href: '/ai/basic/text-generation/manage-responses',
                },
                {
                  title: 'Custom commands',
                  href: '/ai/basic/text-generation/custom-commands',
                },
                {
                  title: 'Stream content (Advanced)',
                  href: '/ai/basic/text-generation/stream',
                },
              ],
            },
            {
              title: 'Image generation',
              href: '/ai/basic/image-generation',
            },
            {
              title: 'Integrate your LLM',
              href: '/ai/basic/custom-llms',
            },
            {
              title: 'Configure',
              href: '/ai/basic/configure',
            },
          ],
        },
      ],
    },
  ],
}
