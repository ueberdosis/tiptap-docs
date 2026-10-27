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
import { planFromLabel } from '@/content/plans'
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
        children: [
          { href: '/authentication/migrate', title: 'Migrate from legacy' },
          { href: '/authentication/legacy', title: 'Legacy authentication' },
        ],
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
          { ...link(aiSidebar, ['AI Toolkit']), href: '' },
          ...childrenOf(aiSidebar, ['Other Options']),
          {
            title: 'AI Legacy',
            href: '',
            // Paid like the rest of AI; the label says Deprecated
            tags: ['Deprecated', 'Paid'],
            children: [
              section('AI Assistant', aiAssistantSidebar, legacyOptions),
              section('AI Suggestion', aiSuggestionSidebar, legacyOptions),
              section('AI Changes', aiChangesSidebar, legacyOptions),
            ],
          },
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
      {
        ...compare,
        children: [
          ...compare.children!,
          {
            ...link(collaborationSidebar, ['Documents', 'Compare Snapshots']),
            title: 'Compare snapshots',
          },
        ],
      },
      feature('Conversion', conversionSidebar, '/conversion/getting-started/overview', {
        inline: ['Get started'],
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
      ...childrenOf(editorSidebar, ['Extensions']).filter((entry) =>
        ['Nodes', 'Marks', 'Functionality'].includes(entry.title),
      ),
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
]

export const sidebarConfig: SidebarConfig = {
  id: 'all-docs',
  rootHref: '/',
  title: 'Home',
  items: items.map(planLabels),
}
