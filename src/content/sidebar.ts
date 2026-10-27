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
import { CATALOG_GROUPS, CatalogArea, catalogGroupUrl } from '@/content/catalog'
import { planFromLabel } from '@/content/plans'
import { getCatalog } from '@/server/getCatalog'
import { legacyFeature } from '@/content/legacy'
import { pagePlan } from '@/server/pagePlan'
import { SidebarConfig, SidebarGroup } from '@/types'
import { SidebarEntry, childrenOf, pick, section, toEntries } from '@/utils/composeSidebar'

// The one sidebar for all documentation. Each section keeps its own sidebar
// next to its content; this file decides where the sections sit. UI Components
// keeps a separate sidebar (src/content/ui-components/sidebar.ts).

/** One entry of a section sidebar, by its path of titles. */
function link(config: SidebarConfig, titles: string[]): SidebarEntry {
  return toEntries([pick(config, titles)])[0]
}

/** Entries without the legacy pages, which have their place in the Legacy area. */
function current(entries: SidebarEntry[]): SidebarEntry[] {
  return entries
    .filter((entry) => !entry.href || !legacyFeature(entry.href))
    .map((entry) => (entry.children ? { ...entry, children: current(entry.children) } : entry))
}

/** The legacy pages of a section sidebar, as entries. */
function legacyOf(config: SidebarConfig): SidebarEntry[] {
  const found: SidebarEntry[] = []
  const walk = (entries: SidebarEntry[]) =>
    entries.forEach((entry) =>
      entry.href && legacyFeature(entry.href)
        ? found.push({ ...entry, children: undefined })
        : walk(entry.children ?? []),
    )
  walk(toEntries(config.items))
  return found
}

/** In the Legacy area, the entries don't each repeat the label. */
function quiet(entries: SidebarEntry[]): SidebarEntry[] {
  return entries.map((entry) => ({
    ...entry,
    hideLegacy: true,
    children: entry.children && quiet(entry.children),
  }))
}

/** The catalog groups of an area, each folding open to its features. */
function catalogGroups(area: CatalogArea): SidebarEntry[] {
  const catalog = getCatalog()
  return (
    CATALOG_GROUPS.filter((group) => group.area === area)
      .map((group) => ({
        title: group.title,
        href: catalogGroupUrl(group) ?? '',
        children: catalog
          .filter((entry) => entry.group === group.id)
          .map((entry) => ({ title: entry.name, href: entry.url, tags: catalogTags(entry) })),
      }))
      .filter((group) => group.children.length > 0)
      // A group of one is just that entry
      .map((group) => (group.children.length === 1 ? group.children[0] : group))
  )
}

/** A feature's status and plan as sidebar tags; the sidebar shows only the label that matters. */
function catalogTags(entry: { plan?: string; status?: string }): string[] | undefined {
  const tags = [entry.status, entry.plan !== 'Open source' ? entry.plan : undefined].filter(
    (tag): tag is string => !!tag,
  )
  return tags.length ? tags : undefined
}

/** A feature's plan as a sidebar tag, from the frontmatter of its overview page. */
function planTags(overview: string): string[] | undefined {
  const plan = pagePlan(overview)
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

const isPaidPlan = (tag: string) => {
  const plan = planFromLabel(tag)
  return !!plan && plan !== 'Open source'
}
const isPaid = (tags?: string[]) => !!tags?.some((tag) => tag === 'Paid' || isPaidPlan(tag))

/**
 * An entry whose children all need a paid plan, whichever, says "Paid"; a group
 * that mixes paid and open source says nothing. The tag is for the label only:
 * page headers still take the plan from the pages and their features.
 */
function withSharedPlan(entry: SidebarEntry): SidebarEntry {
  if (!entry.children?.length) return entry
  const children = entry.children.map(withSharedPlan)
  const allPaid = children.every((child) => isPaid(child.tags))
  return isPaid(entry.tags) || !allPaid
    ? { ...entry, children }
    : { ...entry, tags: [...(entry.tags ?? []), 'Paid'], children }
}

/** Below a paid entry, its pages don't repeat the label: they share it. */
function labelWhereItDiffers(entries: SidebarEntry[], underPaid = false): SidebarEntry[] {
  return entries.map((entry) => {
    const paid = isPaid(entry.tags)
    return {
      ...entry,
      hidePlan: underPaid && paid ? true : undefined,
      children: entry.children && labelWhereItDiffers(entry.children, underPaid || paid),
    }
  })
}

/** Plan labels in a sidebar group: shared plans move up, repeated ones go. */
function planLabels(group: SidebarGroup): SidebarGroup {
  return { ...group, children: labelWhereItDiffers(group.children.map(withSharedPlan)) }
}

const compare = feature('Compare', compareSidebar, '/compare/getting-started/overview', {
  inline: ['Get started'],
})

const legacyOptions = { inline: ['Get started'], omit: ['← Back to Content AI'] }

// Guides and Examples have their own areas; the trial sits under Getting started
const elsewhere = ['/guides', '/examples', '/resources/tiptap-trial']

const items: SidebarGroup[] = [
  {
    type: 'group',
    title: 'Getting started',
    href: '/getting-started',
    collapsible: true,
    defaultOpen: true,
    children: [
      { href: '/', title: 'Overview' },
      { ...link(editorSidebar, ['Get started', 'Overview']), title: 'Tiptap Editor' },
      { ...link(editorSidebar, ['Get started', 'Install']), title: 'Quick start' },
      {
        href: '/authentication',
        title: 'Authentication',
        newSince: '2026-04-29',
        children: [{ href: '/authentication/migrate', title: 'Migrate from legacy' }],
      },
      { ...link(guidesSidebar, ['First Steps', 'Integrate Pro Extensions']), title: 'Pro access' },
      { href: '/resources/tiptap-trial', title: 'Tiptap trial' },
      { href: '/resources/whats-new', title: "What's new in 3.0" },
    ],
  },
  {
    type: 'group',
    title: 'Features',
    href: '/features',
    collapsible: true,
    divider: true,
    children: [
      { ...link(editorSidebar, ['Extensions', 'Overview']), title: 'All features' },
      // The products of the Tiptap Platform first, then the editor's extensions
      {
        title: 'AI',
        href: '',
        children: [
          {
            ...link(aiSidebar, ['AI Toolkit']),
            href: '',
            children: current(childrenOf(aiSidebar, ['AI Toolkit'])),
          },
          ...current(childrenOf(aiSidebar, ['Other Options'])),
        ],
      },
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
      compare,
      feature('Conversion', conversionSidebar, '/conversion/getting-started/overview', {
        inline: ['Get started'],
        omit: ['Legacy'],
      }),
      feature(
        'Composable Docs',
        composableDocsSidebar,
        '/composable-docs/slots/getting-started/overview',
      ),
      feature('Pages', pagesSidebar, '/pages/getting-started/overview', {
        inline: ['Getting started'],
      }),
      {
        ...link(editorSidebar, ['Whiteboard']),
        href: '',
        tags: planTags('/editor/whiteboard/getting-started/overview'),
        // The AI agent guide has its place in the AI Toolkit
        children: childrenOf(editorSidebar, ['Whiteboard']).filter(
          (entry) => entry.href !== '/ai/ai-toolkit/agents/whiteboard',
        ),
      },
      ...catalogGroups('editor'),
      ...toEntries([pick(editorSidebar, ['Markdown'])]),
    ],
  },
  {
    // Where documents live, sync, and run: the base the features of the platform build on
    type: 'group',
    title: 'Documents',
    href: '/documents',
    collapsible: true,
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
      section('Hocuspocus', hocuspocusSidebar, {
        inline: ['Get started'],
        tags: ['Open source'],
      }),
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
    ],
  },
  {
    type: 'group',
    title: 'Custom extensions',
    href: '/custom-extensions',
    collapsible: true,
    children: [
      {
        ...link(editorSidebar, ['Extensions', 'Custom extensions']),
        title: 'Overview',
        children: undefined,
      },
      ...childrenOf(editorSidebar, ['Extensions', 'Custom extensions']),
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
    title: 'Guides',
    href: '/guides',
    collapsible: true,
    children: [
      { href: '/guides', title: 'Overview' },
      // Pro access sits under Getting started
      ...toEntries(guidesSidebar.items.filter((item) => item.title !== 'First Steps')),
    ],
  },
  {
    type: 'group',
    title: 'Examples',
    href: '/examples',
    collapsible: true,
    children: [
      { href: '/examples', title: 'Overview' },
      ...toEntries(examplesSidebar.items.filter((item) => item.title !== 'Get started')),
    ],
  },
  {
    type: 'group',
    title: 'Resources',
    href: '/resources',
    collapsible: true,
    children: childrenOf(resourcesSidebar, ['Resources']).filter(
      (entry) => !elsewhere.includes(entry.href),
    ),
  },
  {
    // Kept for existing projects. Its pages keep their URLs; only their place in
    // the sidebar moves here, so the areas above show what to build with today.
    type: 'group',
    title: 'Legacy',
    href: '/legacy',
    collapsible: true,
    divider: true,
    children: quiet([
      {
        title: 'AI',
        href: '',
        // Paid like the rest of AI
        tags: ['Legacy', 'Paid'],
        children: [
          section('AI Assistant', aiAssistantSidebar, legacyOptions),
          section('AI Suggestion', aiSuggestionSidebar, legacyOptions),
          section('AI Changes', aiChangesSidebar, legacyOptions),
          {
            title: 'AI Toolkit',
            href: '',
            tags: planTags('/ai/ai-toolkit/overview'),
            children: legacyOf(aiSidebar),
          },
        ],
      },
      // The two that fold open first, then the single pages
      {
        ...toEntries([pick(conversionSidebar, ['Legacy'])])[0],
        title: 'Conversion',
        tags: ['Legacy', ...(planTags('/conversion/getting-started/overview') ?? [])],
      },
      {
        ...link(collaborationSidebar, ['Documents', 'Compare Snapshots']),
        title: 'Compare snapshots',
      },
      { href: '/authentication/legacy', title: 'Authentication' },
    ]),
  },
]

export const sidebarConfig: SidebarConfig = {
  id: 'all-docs',
  rootHref: '/',
  title: 'Home',
  items: items.map(planLabels),
}
