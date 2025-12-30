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
              title: 'Live Demo',
              href: '/content-ai/capabilities/ai-toolkit/live-demo',
            },
            {
              title: 'Quickstart guides',
              href: '/content-ai/capabilities/ai-toolkit/guides',
              children: [
                {
                  title: 'AI agent chatbot',
                  href: '/content-ai/capabilities/ai-toolkit/guides/ai-agent-chatbot',
                },
                {
                  title: 'Review changes',
                  href: '/content-ai/capabilities/ai-toolkit/guides/review-changes',
                },
                {
                  title: 'Review as summary',
                  href: '/content-ai/capabilities/ai-toolkit/guides/review-changes-as-summary',
                },
                {
                  title: 'Tool streaming',
                  href: '/content-ai/capabilities/ai-toolkit/guides/tool-streaming',
                },
                {
                  title: 'Inline edits',
                  href: '/content-ai/capabilities/ai-toolkit/guides/inline-edits',
                },
              ],
            },
            {
              title: 'Advanced guides',
              href: '/content-ai/capabilities/ai-toolkit/advanced-guides',
              children: [
                {
                  title: 'AI engineering guide',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/ai-engineering',
                },
                {
                  title: 'Add comments',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/comments',
                },
                {
                  title: 'Multi-document AI agent',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/multi-document',
                },
                {
                  title: 'Selection awareness',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/selection-awareness',
                },
                {
                  title: 'Style suggestions',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/style-suggestions',
                },
                {
                  title: 'Schema awareness',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/schema-awareness',
                },
                {
                  title: 'Compare documents',
                  href: '/content-ai/capabilities/ai-toolkit/advanced-guides/compare-documents',
                },
              ],
            },
            {
              title: 'AI agent tools',
              href: '/content-ai/capabilities/ai-toolkit/tools',
              children: [
                {
                  title: 'Available tools',
                  href: '/content-ai/capabilities/ai-toolkit/tools/available-tools',
                },
                {
                  title: 'Vercel AI SDK',
                  href: '/content-ai/capabilities/ai-toolkit/tools/ai-sdk',
                },
                {
                  title: 'LangChain.js',
                  href: '/content-ai/capabilities/ai-toolkit/tools/langchain-js',
                },
                {
                  title: 'OpenAI',
                  href: '/content-ai/capabilities/ai-toolkit/tools/openai',
                },
                {
                  title: 'Anthropic',
                  href: '/content-ai/capabilities/ai-toolkit/tools/anthropic',
                },
                {
                  title: 'Mastra',
                  href: '/content-ai/capabilities/ai-toolkit/tools/mastra',
                },
                {
                  title: 'Other providers',
                  href: '/content-ai/capabilities/ai-toolkit/tools/other-providers',
                },
              ],
            },
            {
              title: 'Workflows',
              href: '/content-ai/capabilities/ai-toolkit/workflows',
              children: [
                {
                  title: 'Proofreader',
                  href: '/content-ai/capabilities/ai-toolkit/workflows/proofreader',
                },
              ],
            },
            {
              title: 'API reference',
              href: '/content-ai/capabilities/ai-toolkit/primitives',
              children: [
                {
                  title: 'Execute tool (AI agents)',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/execute-tool',
                },
                {
                  title: 'Read the document',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/read-the-document',
                },
                {
                  title: 'Edit the document',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/edit-the-document',
                },
                {
                  title: 'Schema awareness',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/schema-awareness',
                },
                {
                  title: 'Display suggestions',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/display-suggestions',
                },
                {
                  title: 'Compare documents',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/compare-documents',
                },
                {
                  title: 'Diff utility',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/diff-utility',
                },
                {
                  title: 'Workflows',
                  href: '/content-ai/capabilities/ai-toolkit/primitives/workflows',
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
            {
              title: 'Migration guides',
              href: '/content-ai/capabilities/ai-toolkit/migration-guides',
              children: [
                {
                  title: 'AI Generation',
                  href: '/content-ai/capabilities/ai-toolkit/migration-guides/ai-generation',
                },
                {
                  title: 'AI Suggestion',
                  href: '/content-ai/capabilities/ai-toolkit/migration-guides/ai-suggestion',
                },
                {
                  title: 'AI Changes',
                  href: '/content-ai/capabilities/ai-toolkit/migration-guides/ai-changes',
                },
                {
                  title: 'AI Assistant',
                  href: '/content-ai/capabilities/ai-toolkit/migration-guides/ai-assistant',
                },
              ],
            },
          ],
        },
        {
          title: 'Server AI Toolkit',
          href: '/content-ai/capabilities/server-ai-toolkit/overview',
          tags: ['Alpha'],
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
