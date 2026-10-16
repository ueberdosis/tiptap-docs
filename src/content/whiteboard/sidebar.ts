import { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'whiteboard',
  rootHref: '/whiteboard/getting-started/overview',
  title: 'Whiteboard',
  items: [
    {
      type: 'group',
      href: '/whiteboard/getting-started',
      title: 'Get started',
      children: [
        {
          title: 'Overview',
          href: '/whiteboard/getting-started/overview',
        },
        {
          title: 'Install',
          href: '/whiteboard/getting-started/install',
        },
      ],
    },
    {
      type: 'group',
      href: '/whiteboard/guides',
      title: 'Guides',
      children: [
        {
          title: 'Stage and camera',
          href: '/whiteboard/guides/stage-and-camera',
        },
        {
          title: 'Shapes and tools',
          href: '/whiteboard/guides/shapes-and-tools',
        },
        {
          title: 'Doc frames',
          href: '/whiteboard/guides/doc-frames',
        },
        {
          title: 'Collaboration',
          href: '/whiteboard/guides/collaboration',
        },
        {
          title: 'Tracked Changes on the board',
          href: '/whiteboard/guides/tracked-changes',
        },
      ],
    },
    {
      type: 'group',
      href: '/whiteboard/examples',
      title: 'Examples',
      children: [
        {
          title: 'Simple whiteboard',
          href: '/whiteboard/examples/simple',
        },
      ],
    },
    {
      type: 'group',
      href: '/whiteboard/api-reference',
      title: 'API Reference',
      children: [
        {
          title: 'Extensions',
          href: '/whiteboard/api-reference/extensions',
        },
        {
          title: 'Commands',
          href: '/whiteboard/api-reference/commands',
        },
        {
          title: 'Events',
          href: '/whiteboard/api-reference/events',
        },
        {
          title: 'Utilities',
          href: '/whiteboard/api-reference/utilities',
        },
        {
          title: 'Types',
          href: '/whiteboard/api-reference/types',
        },
        {
          title: 'Styling',
          href: '/whiteboard/api-reference/styling',
        },
      ],
    },
  ],
}
