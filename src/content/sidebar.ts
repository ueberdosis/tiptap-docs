import { sidebarConfig as aiAssistantSidebar } from './ai/deprecated/agent/sidebar'
import { sidebarConfig as aiChangesSidebar } from './ai/deprecated/changes/sidebar'
import { sidebarConfig as aiSuggestionSidebar } from './ai/deprecated/suggestion/sidebar'
import { sidebarConfig as aiSidebar } from './ai/sidebar'
import { sidebarConfig as collaborationSidebar } from './collaboration/sidebar'
import { sidebarConfig as commentsSidebar } from './comments/sidebar'
import { sidebarConfig as compareSidebar } from './compare/sidebar'
import { sidebarConfig as composableDocsSidebar } from './composable-docs/sidebar'
import { sidebarConfig as conversionSidebar } from './conversion/sidebar'
import { sidebarConfig as editorSidebar } from './editor/sidebar'
import { sidebarConfig as examplesSidebar } from './examples/sidebar'
import { sidebarConfig as guidesSidebar } from './guides/sidebar'
import { sidebarConfig as hocuspocusSidebar } from './hocuspocus/sidebar'
import { sidebarConfig as pagesSidebar } from './pages/sidebar'
import { sidebarConfig as resourcesSidebar } from './resources/sidebar'
import { sidebarConfig as trackedChangesSidebar } from './tracked-changes/sidebar'
import { SidebarConfig } from '@/types'
import { childrenOf, pick, section, toEntries } from '@/utils/composeSidebar'

// The one sidebar for all documentation. Each section keeps its own sidebar
// next to its content; this file decides where the sections sit. UI Components
// keeps a separate sidebar (src/content/ui-components/sidebar.ts).

const legacyOptions = { inline: ['Get started'], omit: ['← Back to Content AI'] }

export const sidebarConfig: SidebarConfig = {
  id: 'all-docs',
  rootHref: '/',
  title: 'Home',
  items: [
    {
      type: 'group',
      title: 'Getting started',
      href: '/getting-started',
      collapsible: true,
      defaultOpen: true,
      children: [
        { href: '/', title: 'Introduction' },
        { href: '/resources/whats-new', title: "What's new in 3.0" },
        {
          href: '/authentication',
          title: 'Authentication',
          children: [
            { href: '/authentication/migrate', title: 'Migrate from legacy' },
            { href: '/authentication/legacy', title: 'Legacy authentication' },
          ],
        },
        { href: '/guides/pro-extensions', title: 'Pro extensions' },
        { href: '/resources/tiptap-trial', title: 'Tiptap trial' },
      ],
    },
    {
      type: 'group',
      title: 'Editor',
      href: '/editor',
      tags: ['Open source'],
      collapsible: true,
      children: [
        ...childrenOf(editorSidebar, ['Get started']),
        {
          title: 'Core concepts',
          href: '',
          children: childrenOf(editorSidebar, ['Core Concepts']),
        },
        { title: 'Extensions', href: '', children: childrenOf(editorSidebar, ['Extensions']) },
        ...toEntries([pick(editorSidebar, ['Markdown'])]),
        { title: 'API reference', href: '', children: childrenOf(editorSidebar, ['API']) },
      ],
    },
    {
      type: 'group',
      title: 'Document Platform',
      href: '/document-platform',
      collapsible: true,
      children: [
        section('Collaboration', collaborationSidebar, { inline: ['Get started'] }),
        section('Comments', commentsSidebar, { inline: ['Get started'] }),
        section('Tracked Changes', trackedChangesSidebar, {
          inline: ['Get started'],
          // Links to Conversion pages, which have their place there
          omit: ['DOCX conversion'],
        }),
        section('Compare', compareSidebar, { inline: ['Get started'] }),
        section('Composable Docs', composableDocsSidebar),
        section('Pages', pagesSidebar, { inline: ['Getting started'] }),
        section('Conversion', conversionSidebar, { inline: ['Get started'] }),
        { title: 'AI Toolkit', href: '', children: childrenOf(aiSidebar, ['AI Toolkit']) },
        { ...toEntries([pick(aiSidebar, ['Other Options', 'Client Toolkit'])])[0], href: '' },
        {
          ...toEntries([pick(aiSidebar, ['Other Options', 'Basic AI Generation'])])[0],
          href: '',
        },
        {
          title: 'AI Legacy',
          href: '',
          tags: ['Deprecated'],
          children: [
            section('AI Assistant', aiAssistantSidebar, legacyOptions),
            section('AI Suggestion', aiSuggestionSidebar, legacyOptions),
            section('AI Changes', aiChangesSidebar, legacyOptions),
          ],
        },
      ],
    },
    {
      type: 'group',
      title: 'Self-hosting',
      href: '/hocuspocus',
      tags: ['Open source'],
      collapsible: true,
      children: [section('Hocuspocus', hocuspocusSidebar, { inline: ['Get started'] })],
    },
    {
      type: 'group',
      title: 'Learn',
      href: '/learn',
      collapsible: true,
      children: [
        {
          title: 'Guides',
          href: '/guides',
          // Pro extensions sits under Getting started
          children: toEntries(guidesSidebar.items.filter((item) => item.title !== 'First Steps')),
        },
        {
          title: 'Examples',
          href: '/examples',
          children: toEntries(examplesSidebar.items.filter((item) => item.title !== 'Get started')),
        },
      ],
    },
    {
      type: 'group',
      title: 'Resources',
      href: '/resources',
      collapsible: true,
      children: childrenOf(resourcesSidebar, ['Resources']),
    },
  ],
}
