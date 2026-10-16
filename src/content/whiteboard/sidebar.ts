import type { SidebarConfig } from '@/types'

export const sidebarConfig: SidebarConfig = {
  id: 'whiteboard',
  title: 'Whiteboard',
  rootHref: '/whiteboard/getting-started/overview',
  items: [
    {
      type: 'group',
      title: 'Whiteboard',
      href: '/whiteboard',
      children: [
        { title: 'Overview', href: '/whiteboard/getting-started/overview' },
        {
          title: 'Guides',
          href: '/whiteboard/guides/react',
          children: [
            { title: 'React', href: '/whiteboard/guides/react' },
            { title: 'Stage and camera', href: '/whiteboard/guides/stage-and-camera' },
            { title: 'Shapes and tools', href: '/whiteboard/guides/shapes-and-tools' },
            { title: 'Doc frames', href: '/whiteboard/guides/doc-frames' },
            { title: 'Collaboration on the board', href: '/whiteboard/guides/collaboration' },
            {
              title: 'Tracked Changes on the board',
              href: '/whiteboard/guides/tracked-changes',
            },
          ],
        },
        {
          title: 'Examples',
          href: '/whiteboard/examples/simple',
          children: [{ title: 'Simple whiteboard', href: '/whiteboard/examples/simple' }],
        },
        { title: 'AI agents', href: '/ai/ai-toolkit/agents/whiteboard' },
        {
          title: 'API reference',
          href: '/whiteboard/api-reference/extensions',
          children: [
            { title: 'Extensions', href: '/whiteboard/api-reference/extensions' },
            { title: 'Commands', href: '/whiteboard/api-reference/commands' },
            { title: 'Utilities', href: '/whiteboard/api-reference/utilities' },
            { title: 'Types', href: '/whiteboard/api-reference/types' },
            { title: 'Styling', href: '/whiteboard/api-reference/styling' },
            { title: 'Editor events', href: '/whiteboard/api-reference/events' },
          ],
        },
      ],
    },
  ],
}
