import type { SidebarConfig } from '@/types'

const guides = '/citations/guides'
const api = '/citations/api-reference'

export const sidebarConfig: SidebarConfig = {
  id: 'citations',
  rootHref: '/citations/getting-started/overview',
  title: 'Smart Citations',
  items: [
    {
      type: 'group',
      title: 'Get started',
      href: '/citations/getting-started',
      children: [
        { title: 'Overview', href: '/citations/getting-started/overview' },
        { title: 'Install', href: '/citations/getting-started/install' },
      ],
    },
    {
      type: 'link',
      title: 'Guides',
      href: `${guides}/usage`,
      defaultOpen: true,
      children: [
        { title: 'Review', href: `${guides}/review` },
        { title: 'Sources', href: `${guides}/sources` },
        { title: 'Rendering', href: `${guides}/rendering` },
        { title: 'Review sidebar', href: `${guides}/review-sidebar` },
        { title: 'Cite nodes', href: `${guides}/cite-nodes` },
        { title: 'Copy and paste', href: `${guides}/copy-and-paste` },
        { title: 'Collaboration', href: `${guides}/collaboration` },
      ],
    },
    {
      type: 'link',
      title: 'API reference',
      href: api,
      defaultOpen: true,
      children: [
        { title: 'Extension', href: `${api}/extension` },
        { title: 'Commands', href: `${api}/commands` },
        { title: 'Queries', href: `${api}/queries` },
        { title: 'Sources', href: `${api}/sources` },
        { title: 'Source data', href: `${api}/source-data` },
        { title: 'Types', href: `${api}/types` },
        { title: 'Errors', href: `${api}/errors` },
      ],
    },
  ],
}
