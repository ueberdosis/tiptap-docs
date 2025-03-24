import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'content-ai',
  rootHref: '/v3/content-ai/getting-started/overview',
  title: 'Content AI',
  items: [
    {
      type: 'group',
      href: '/v3/content-ai/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/v3/content-ai/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/v3/content-ai/getting-started/install',
        },
        {
          title: 'Configure',
          href: '/v3/content-ai/getting-started/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/content-ai/capabilities',
      title: 'Capabilities',
      children: [
        {
          title: 'Text generation',
          href: '/v3/content-ai/capabilities/text-generation',
          children: [
            {
              title: 'Built-in commands',
              href: '/v3/content-ai/capabilities/text-generation/built-in-commands',
            },
            {
              title: 'Autocompletion',
              href: '/v3/content-ai/capabilities/text-generation/autocompletion',
            },
            {
              title: 'Provide context',
              href: '/v3/content-ai/capabilities/text-generation/provide-context',
            },
            {
              title: 'Formatted responses',
              href: '/v3/content-ai/capabilities/text-generation/format',
            },
            {
              title: 'Manage responses',
              href: '/v3/content-ai/capabilities/text-generation/manage-responses',
            },
            {
              title: 'Custom commands',
              href: '/v3/content-ai/capabilities/text-generation/custom-commands',
            },
            {
              title: 'Stream content (Advanced)',
              href: '/v3/content-ai/capabilities/text-generation/stream',
            },
          ],
        },
        {
          title: 'Image generation',
          href: '/v3/content-ai/capabilities/image-generation',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/content-ai/custom-llms',
      title: 'Custom LLMs',
      children: [
        {
          title: 'Integrate your LLM',
          href: '/v3/content-ai/custom-llms/integrate',
        },
      ],
    },
    {
      type: 'group',
      href: '/v3/content-ai/resources',
      title: 'Resources',
      children: [
        {
          title: 'Privacy',
          href: '/v3/content-ai/resources/privacy',
        },
      ],
    },
  ],
}
