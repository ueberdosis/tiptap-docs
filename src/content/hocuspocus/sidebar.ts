import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'hocuspocus',
  rootHref: '/hocuspocus/getting-started/overview',
  title: 'Hocuspocus',
  items: [
    {
      type: 'group',
      href: '/hocuspocus/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/hocuspocus/getting-started/overview',
        },
        {
          title: 'About the project',
          href: '/hocuspocus/getting-started/sponsor',
        },
        {
          title: 'Contributing',
          href: '/hocuspocus/getting-started/contributing',
        },
        {
          title: 'Upgrade Guide',
          href: '/hocuspocus/getting-started/upgrade',
        },
      ],
    },
    {
      type: 'group',
      href: '/hocuspocus/provider',
      title: 'Provider',
      children: [
        {
          title: 'Overview',
          href: '/hocuspocus/provider/overview',
        },
        {
          title: 'Install',
          href: '/hocuspocus/provider/install',
        },
        {
          title: 'Configuration',
          href: '/hocuspocus/provider/configuration',
        },
        {
          title: 'Events',
          href: '/hocuspocus/provider/events',
        },
        {
          title: 'Examples',
          href: '/hocuspocus/provider/examples',
        },
      ],
    },
    {
      type: 'group',
      href: '/hocuspocus/server',
      title: 'Server',
      children: [
        {
          title: 'Configuration',
          href: '/hocuspocus/server/configuration',
        },
        {
          title: 'Hooks',
          href: '/hocuspocus/server/hooks',
        },
        {
          title: 'Usage',
          href: '/hocuspocus/server/usage',
        },
        {
          title: 'Examples',
          href: '/hocuspocus/server/examples',
        },
      ],
    },
    {
      type: 'group',
      href: '/hocuspocus/server/extensions',
      title: 'Server Extensions',
      children: [
        {
          title: 'Overview',
          href: '/hocuspocus/server/extensions/overview',
        },
        {
          title: 'Database',
          href: '/hocuspocus/server/extensions/database',
        },
        {
          title: 'Logger',
          href: '/hocuspocus/server/extensions/logger',
        },
        {
          title: 'Redis',
          href: '/hocuspocus/server/extensions/redis',
        },
        {
          title: 'SQLite',
          href: '/hocuspocus/server/extensions/sqlite',
        },
        {
          title: 'Throttle',
          href: '/hocuspocus/server/extensions/throttle',
        },
        {
          title: 'Webhook',
          href: '/hocuspocus/server/extensions/webhook',
        },
        {
          title: 'S3',
          href: '/hocuspocus/server/extensions/s3',
        },
      ],
    },
    {
      type: 'group',
      href: '/hocuspocus/guides',
      title: 'Guides',
      children: [
        {
          title: 'Authentication',
          href: '/hocuspocus/guides/authentication',
        },
        {
          title: 'Persistence',
          href: '/hocuspocus/guides/persistence',
        },
        {
          title: 'Collaborative Editing',
          href: '/hocuspocus/guides/collaborative-editing',
        },
        {
          title: 'Custom Extensions',
          href: '/hocuspocus/guides/custom-extensions',
        },
        {
          title: 'Awareness',
          href: '/hocuspocus/guides/awareness',
        },
        {
          title: 'Multi Subdocuments',
          href: '/hocuspocus/guides/multi-subdocuments',
        },
        {
          title: 'Scalability',
          href: '/hocuspocus/guides/scalability',
        },
      ],
    },
  ],
}
