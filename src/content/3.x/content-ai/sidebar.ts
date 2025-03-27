import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'content-ai',
  rootHref: '/3.x/content-ai/getting-started/overview',
  title: 'Content AI',
  items: [
    {
      href: '/3.x/content-ai/getting-started/overview',
      title: 'Getting started',
      type: 'group',
      children: [
        {
          title: 'Overview',
          href: '/3.x/content-ai/getting-started/overview',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/content-ai/capabilities',
      title: 'Capabilities',
      children: [
        {
          title: 'AI Generation',
          tags: ['Pro'],
          href: '/3.x/content-ai/capabilities/generation/overview',
          children: [
            {
              title: 'Overview',
              href: '/3.x/content-ai/capabilities/generation/overview',
            },
            {
              title: 'Install',
              href: '/3.x/content-ai/capabilities/generation/install',
            },
            {
              title: 'Text generation',
              href: '/3.x/content-ai/capabilities/generation/text-generation/built-in-commands',
              children: [
                {
                  title: 'Built-in commands',
                  href: '/3.x/content-ai/capabilities/generation/text-generation/built-in-commands',
                },
                {
                  title: 'Autocompletion',
                  href: '/3.x/content-ai/capabilities/generation/text-generation/autocompletion',
                },
                {
                  title: 'Provide context',
                  href: '/3.x/content-ai/capabilities/generation/text-generation/provide-context',
                },
                {
                  title: 'Formatted responses',
                  href: '/3.x/content-ai/capabilities/generation/text-generation/format',
                },
                {
                  title: 'Manage responses',
                  href: '/3.x/content-ai/capabilities/generation/text-generation/manage-responses',
                },
                {
                  title: 'Custom commands',
                  href: '/3.x/content-ai/capabilities/generation/text-generation/custom-commands',
                },
                {
                  title: 'Stream content (Advanced)',
                  href: '/3.x/content-ai/capabilities/generation/text-generation/stream',
                },
              ],
            },
            {
              title: 'Image generation',
              href: '/3.x/content-ai/capabilities/generation/image-generation',
            },
            {
              title: 'Integrate your LLM',
              href: '/3.x/content-ai/capabilities/generation/custom-llms',
            },
            {
              title: 'Configure',
              href: '/3.x/content-ai/capabilities/generation/configure',
            },
          ],
        },
        {
          title: 'AI Suggestion',
          href: '/3.x/content-ai/capabilities/suggestion/overview',
          tags: ['Pro', 'Beta'],
          children: [
            {
              title: 'Overview',
              href: '/3.x/content-ai/capabilities/suggestion/overview',
            },
            {
              title: 'Install',
              href: '/3.x/content-ai/capabilities/suggestion/install',
            },
            {
              title: 'Features',
              href: '/3.x/content-ai/capabilities/suggestion/features/define-rules',
              children: [
                {
                  title: 'Define rules',
                  href: '/3.x/content-ai/capabilities/suggestion/features/define-rules',
                },
                {
                  title: 'Configure when to load suggestions',
                  href: '/3.x/content-ai/capabilities/suggestion/features/configure-when-to-load-suggestions',
                },
                {
                  title: 'Display suggestions',
                  href: '/3.x/content-ai/capabilities/suggestion/features/display-suggestions',
                },
                {
                  title: 'Apply and reject suggestions',
                  href: '/3.x/content-ai/capabilities/suggestion/features/apply-suggestions',
                },
                {
                  title: 'Lock content',
                  href: '/3.x/content-ai/capabilities/suggestion/features/lock-content',
                },
              ],
            },
            {
              title: 'Use with Content AI Cloud',
              href: '/3.x/content-ai/capabilities/suggestion/use-with-content-ai-cloud',
            },
            {
              title: 'Integrate your LLM',
              href: '/3.x/content-ai/capabilities/suggestion/custom-llms',
            },
            {
              title: 'Configure',
              href: '/3.x/content-ai/capabilities/suggestion/configure',
            },
            {
              title: 'API Reference',
              href: '/3.x/content-ai/capabilities/suggestion/api-reference',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      href: '',
      title: 'Examples',
      children: [
        {
          title: 'Text Generation',
          isActive: false,
          href: '/3.x/content-ai/capabilities/generation/overview',
        },
        {
          title: 'Autocomplete',
          isActive: false,
          href: '/3.x/content-ai/capabilities/generation/text-generation/autocompletion',
        },
        {
          title: 'AI Suggestions',
          isActive: false,
          href: '/3.x/content-ai/capabilities/suggestion/overview',
        },
        {
          title: 'Starter templates',
          href: 'https://tiptap.dev/product/templates',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/content-ai/custom-llms',
      title: 'Custom LLMs',
      children: [
        {
          title: 'Integrate your LLM',
          href: '/3.x/content-ai/custom-llms',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/content-ai/resources',
      title: 'Resources',
      children: [
        {
          title: 'Privacy',
          href: '/3.x/content-ai/resources/privacy',
        },
      ],
    },
  ],
}
