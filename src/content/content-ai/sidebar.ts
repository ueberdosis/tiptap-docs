import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'content-ai',
  rootHref: '/content-ai/getting-started/overview',
  title: 'Content AI',
  items: [
    {
      type: 'group',
      href: '/content-ai/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/content-ai/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/content-ai/getting-started/install',
        },
        {
          title: 'Configure',
          href: '/content-ai/getting-started/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/capabilities',
      title: 'Capabilities',
      children: [
        {
          title: 'Text generation',
          href: '/content-ai/capabilities/text-generation',
          children: [
            {
              title: 'Built-in commands',
              href: '/content-ai/capabilities/text-generation/built-in-commands',
            },
            {
              title: 'Autocompletion',
              href: '/content-ai/capabilities/text-generation/autocompletion',
            },
            {
              title: 'Provide context',
              href: '/content-ai/capabilities/text-generation/provide-context',
            },
            {
              title: 'Formatted responses',
              href: '/content-ai/capabilities/text-generation/format',
            },
            {
              title: 'Manage responses',
              href: '/content-ai/capabilities/text-generation/manage-responses',
            },
            {
              title: 'Custom commands',
              href: '/content-ai/capabilities/text-generation/custom-commands',
            },
            {
              title: 'Stream content (Advanced)',
              href: '/content-ai/capabilities/text-generation/stream',
            },
          ],
        },
        {
          title: 'Image generation',
          href: '/content-ai/capabilities/image-generation',
        },
      ],
    },
    {
      type: 'group',
      href: '/content-ai/custom-llms',
      title: 'Custom LLMs',
      children: [
        {
          title: 'Integrate your LLM',
          href: '/content-ai/custom-llms/integrate',
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
