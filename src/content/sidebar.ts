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
import { CATALOG_GROUPS, CatalogArea } from '@/content/catalog'
import { getCatalog } from '@/server/getCatalog'
import { SidebarConfig } from '@/types'
import { SidebarEntry, childrenOf, pick, section, toEntries } from '@/utils/composeSidebar'

// The one sidebar for all documentation. Each section keeps its own sidebar
// next to its content; this file decides where the sections sit. UI Components
// keeps a separate sidebar (src/content/ui-components/sidebar.ts).

/** One entry of a section sidebar, by its path of titles. */
function link(config: SidebarConfig, titles: string[]): SidebarEntry {
  return toEntries([pick(config, titles)])[0]
}

/** The catalog groups of an area, each folding open to its features. */
function catalogGroups(area: CatalogArea): SidebarEntry[] {
  const catalog = getCatalog()
  return CATALOG_GROUPS.filter((group) => group.area === area)
    .map((group) => ({
      title: group.title,
      href: '',
      children: catalog
        .filter((entry) => entry.group === group.id)
        .map((entry) =>
          entry.url
            ? {
                title: entry.name,
                href: entry.url,
                tags: entry.plan && entry.plan !== 'Open source' ? [entry.plan] : undefined,
              }
            : { title: entry.name, href: '', tags: ['Soon'], disabled: true },
        ),
    }))
    .filter((group) => group.children.length > 0)
}

/** The plan of a feature page as a sidebar tag, from the catalog. Open source gets none. */
function planTags(href: string): string[] | undefined {
  const plan = getCatalog().find((entry) => entry.url === href)?.plan
  return plan && plan !== 'Open source' ? [plan] : undefined
}

/** A section as one feature entry, tagged with its plan. */
function feature(
  title: string,
  config: SidebarConfig,
  overview: string,
  options: Parameters<typeof section>[2] = {},
): SidebarEntry {
  return section(title, config, { ...options, tags: planTags(overview) })
}

const compare = feature('Compare', compareSidebar, '/compare/getting-started/overview', {
  inline: ['Get started'],
})

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
        { ...link(editorSidebar, ['Get started', 'Overview']), title: 'The editor' },
        { ...link(editorSidebar, ['Get started', 'Install']), title: 'Quick start' },
        { href: '/document-model', title: 'The Tiptap document' },
        {
          href: '/authentication',
          title: 'Authentication',
          children: [
            { href: '/authentication/migrate', title: 'Migrate from legacy' },
            { href: '/authentication/legacy', title: 'Legacy authentication' },
          ],
        },
        { href: '/guides/pro-extensions', title: 'Pro access' },
        { href: '/resources/tiptap-trial', title: 'Tiptap trial' },
        { href: '/resources/whats-new', title: "What's new in 3.0" },
      ],
    },
    {
      type: 'group',
      title: 'Concepts',
      href: '/concepts',
      collapsible: true,
      children: [
        ...childrenOf(editorSidebar, ['Core Concepts']).slice(0, 1),
        link(editorSidebar, ['Get started', 'Configure']),
        link(editorSidebar, ['Get started', 'Styling']),
        ...childrenOf(editorSidebar, ['Core Concepts']).slice(1),
        { title: 'Guides', href: '', children: childrenOf(editorSidebar, ['Guides']) },
      ],
    },
    {
      type: 'group',
      title: 'Features',
      href: '/features',
      collapsible: true,
      children: [
        { ...link(editorSidebar, ['Extensions', 'Overview']), title: 'All features' },
        ...catalogGroups('editor'),
        ...toEntries([pick(editorSidebar, ['Markdown'])]),
        {
          title: 'Review',
          href: '',
          children: [
            feature('Comments', commentsSidebar, '/comments/getting-started/overview', {
              inline: ['Get started'],
            }),
            feature(
              'Tracked Changes',
              trackedChangesSidebar,
              '/tracked-changes/getting-started/overview',
              {
                inline: ['Get started'],
                // Links to Conversion pages, which have their place there
                omit: ['DOCX conversion'],
              },
            ),
          ],
        },
        {
          ...compare,
          children: [
            ...compare.children!,
            // Compares two snapshots; Compare is taking over its job
            {
              ...link(collaborationSidebar, ['Documents', 'Compare Snapshots']),
              title: 'Compare snapshots',
            },
          ],
        },
        feature(
          'Composable Docs',
          composableDocsSidebar,
          '/composable-docs/slots/getting-started/overview',
        ),
        feature('Pages', pagesSidebar, '/pages/getting-started/overview', {
          inline: ['Getting started'],
        }),
        feature('Conversion', conversionSidebar, '/conversion/import/docx/editor-extension', {
          inline: ['Get started'],
        }),
        {
          title: 'AI',
          href: '',
          children: [
            {
              title: 'AI Toolkit',
              href: '',
              tags: planTags('/ai/ai-toolkit/overview'),
              children: childrenOf(aiSidebar, ['AI Toolkit']),
            },
            {
              ...link(aiSidebar, ['Other Options', 'Client Toolkit']),
              href: '',
              title: 'AI Toolkit client',
            },
            { ...link(aiSidebar, ['Other Options', 'Basic AI Generation']), href: '' },
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
      ],
    },
    {
      type: 'group',
      title: 'Build your own',
      href: '/build-your-own',
      collapsible: true,
      children: [
        {
          ...link(editorSidebar, ['Extensions', 'Custom extensions']),
          title: 'Overview',
          children: undefined,
        },
        ...childrenOf(editorSidebar, ['Extensions', 'Custom extensions']),
        {
          title: 'Guides',
          href: '',
          children: childrenOf(editorSidebar, ['Customization guides']),
        },
      ],
    },
    {
      type: 'group',
      title: 'Platform',
      href: '/platform',
      collapsible: true,
      children: [
        // The base every feature on the platform builds on: managed documents with real-time sync
        {
          title: 'Documents',
          href: '',
          children: [
            ...childrenOf(collaborationSidebar, ['Get started']),
            {
              title: 'Document API',
              href: '',
              children: [
                { ...link(collaborationSidebar, ['Documents', 'Overview']), title: 'Overview' },
                link(collaborationSidebar, ['Documents', 'REST API']),
                link(collaborationSidebar, ['Documents', 'Inject content']),
              ],
            },
            link(collaborationSidebar, ['Documents', 'Snapshots']),
            {
              title: 'Real-time sync',
              href: '',
              children: [
                { ...link(collaborationSidebar, ['Provider', 'Integration']), title: 'Provider' },
                { ...link(collaborationSidebar, ['Provider', 'Events']), title: 'Provider events' },
                link(collaborationSidebar, ['Features', 'Awareness']),
              ],
            },
            link(collaborationSidebar, ['Features', 'Webhooks']),
            { title: 'Operations', href: '', children: childrenOf(collaborationSidebar, ['Ops']) },
            { title: 'Guides', href: '', children: childrenOf(collaborationSidebar, ['Guides']) },
          ],
        },
        {
          href: '/hosting',
          title: 'Hosting',
          children: [
            { href: '/hosting/cloud', title: 'Tiptap Cloud' },
            { href: '/hosting/on-premises', title: 'On-premises' },
          ],
        },
        section('Hocuspocus', hocuspocusSidebar, {
          inline: ['Get started'],
          tags: ['Open source'],
        }),
      ],
    },
    {
      type: 'group',
      title: 'API reference',
      href: '/api-reference',
      collapsible: true,
      children: childrenOf(editorSidebar, ['API']),
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
          // Pro access sits under Getting started
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
