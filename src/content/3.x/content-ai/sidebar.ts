import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'content-ai',
  rootHref: '/3.x/content-ai/getting-started/overview',
  title: 'Content AI',
  items: [
    {
      type: 'group',
      href: '/3.x/content-ai/getting-started',
      title: 'Getting started',
      children: [
        {
          title: 'Overview',
          href: '/3.x/content-ai/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/3.x/content-ai/getting-started/install',
        },
        {
          title: 'Configure',
          href: '/3.x/content-ai/getting-started/configure',
        },
      ],
    },
    {
      type: 'group',
      href: '/3.x/content-ai/capabilities',
      title: 'Capabilities',
      children: [
        {
          title: 'Text generation',
          href: '/3.x/content-ai/capabilities/text-generation',
          children: [
            {
              title: 'Built-in commands',
              href: '/3.x/content-ai/capabilities/text-generation/built-in-commands',
            },
            {
              title: 'Autocompletion',
              href: '/3.x/content-ai/capabilities/text-generation/autocompletion',
            },
            {
              title: 'Provide context',
              href: '/3.x/content-ai/capabilities/text-generation/provide-context',
            },
            {
              title: 'Formatted responses',
              href: '/3.x/content-ai/capabilities/text-generation/format',
            },
            {
              title: 'Manage responses',
              href: '/3.x/content-ai/capabilities/text-generation/manage-responses',
            },
            {
              title: 'Custom commands',
              href: '/3.x/content-ai/capabilities/text-generation/custom-commands',
            },
            {
              title: 'Stream content (Advanced)',
              href: '/3.x/content-ai/capabilities/text-generation/stream',
            },
          ],
        },
        {
          title: 'Image generation',
          href: '/3.x/content-ai/capabilities/image-generation',
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
          href: '/3.x/content-ai/custom-llms/integrate',
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
