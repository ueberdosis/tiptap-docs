import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'content-ai',
  rootHref: '/content-ai/extensions/ai/getting-started/overview',
  title: 'Content AI',
  items: [
    {
      href: '/content-ai/extensions/ai/getting-started',
      title: 'Getting started',
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
      href: '/content-ai/extensions',
      title: 'Extensions',
      children: [
        {
          title: 'Content AI',
          tags: ['Pro', 'New'],
          href: '/content-ai/extensions/ai/',
          children: [
            {
              href: '/content-ai/extensions/ai/getting-started',
              title: 'Getting started',
              children: [
                {
                  title: 'Overview',
                  href: '/content-ai/extensions/ai/getting-started/overview',
                },
                {
                  title: 'Install',
                  href: '/content-ai/extensions/ai/getting-started/install',
                },
                {
                  title: 'Configure',
                  href: '/content-ai/extensions/ai/getting-started/configure',
                },
              ],
            },
            {
              title: 'Text generation',
              href: '/content-ai/extensions/ai/capabilities/text-generation',
              children: [
                {
                  title: 'Built-in commands',
                  href: '/content-ai/extensions/ai/capabilities/text-generation/built-in-commands',
                },
                {
                  title: 'Autocompletion',
                  href: '/content-ai/extensions/ai/capabilities/text-generation/autocompletion',
                },
                {
                  title: 'Provide context',
                  href: '/content-ai/extensions/ai/capabilities/text-generation/provide-context',
                },
                {
                  title: 'Formatted responses',
                  href: '/content-ai/extensions/ai/capabilities/text-generation/format',
                },
                {
                  title: 'Manage responses',
                  href: '/content-ai/extensions/ai/capabilities/text-generation/manage-responses',
                },
                {
                  title: 'Custom commands',
                  href: '/content-ai/extensions/ai/capabilities/text-generation/custom-commands',
                },
                {
                  title: 'Stream content (Advanced)',
                  href: '/content-ai/extensions/ai/capabilities/text-generation/stream',
                },
              ],
            },
            {
              title: 'Image generation',
              href: '/content-ai/extensions/ai/capabilities/image-generation',
            },
            {
              title: 'Integrate your LLM',
              href: '/content-ai/extensions/ai/custom-llms/integrate-your-llm',
            },
          ],
        },
        {
          title: 'AI Proofreader',
          href: '/content-ai/extensions/ai-proofreader',
          tags: ['Pro', 'Beta'],
          children: [
            {
              title: 'Getting started',
              href: '/content-ai/extensions/ai-proofreader/getting-started',
              children: [
                {
                  title: 'Overview',
                  href: '/content-ai/extensions/ai-proofreader/getting-started/overview',
                },
                {
                  title: 'Install',
                  href: '/content-ai/extensions/ai-proofreader/getting-started/install',
                },
              ],
            },
            {
              title: 'Features',
              href: '/content-ai/extensions/ai-proofreader/features',
              children: [
                {
                  title: 'Define rules',
                  href: '/content-ai/extensions/ai-proofreader/features/define-rules',
                },
                {
                  title: 'Configure when to load suggestions',
                  href: '/content-ai/extensions/ai-proofreader/features/configure-when-to-load-suggestions',
                },
                {
                  title: 'Display suggestions',
                  href: '/content-ai/extensions/ai-proofreader/features/display-suggestions',
                },
                {
                  title: 'Apply and reject suggestions',
                  href: '/content-ai/extensions/ai-proofreader/features/apply-suggestions',
                },
                {
                  title: 'Lock content',
                  href: '/content-ai/extensions/ai-proofreader/features/lock-content',
                },
              ],
            },
            {
              title: 'Use with Content AI Cloud',
              href: '/content-ai/extensions/ai-proofreader/use-with-content-ai-cloud',
            },
            {
              title: 'Integrate your LLMs',
              href: '/content-ai/extensions/ai-proofreader/integrate-your-llms',
            },
            {
              title: 'Configure',
              href: '/content-ai/extensions/ai-proofreader/configure',
            },
            {
              title: 'API Reference',
              href: '/content-ai/extensions/ai-proofreader/api-reference',
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
      ],
    },
  ],
}
