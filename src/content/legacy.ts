/**
 * What replaces each legacy feature. Pages tagged `legacy`, and the pages
 * under them, show a box under the header that names it. The most specific
 * path wins.
 */
export type LegacyFeature = {
  /** A page's route, or the start of the routes of a feature's pages. */
  path: string
  /** The feature as the box names it, such as "AI Suggestion". */
  name: string
  /** What to use instead. Without `href`, it isn't out yet. */
  replacedBy?: { title: string; href?: string }
  /** How to move to the replacement. */
  migrate?: { title: string; href: string }
  /** In place of a replacement, for a feature without one. */
  note?: { text: string; link: { title: string; href: string } }
  /** When it goes away, if that is decided. */
  removal?: string
}

export const LEGACY_FEATURES: LegacyFeature[] = [
  {
    path: '/ai/deprecated/',
    name: 'the Content AI extensions',
    replacedBy: { title: 'the AI Toolkit', href: '/ai/ai-toolkit/overview' },
    migrate: {
      title: 'The migration guides',
      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides',
    },
  },
  {
    path: '/ai/deprecated/agent/',
    name: 'AI Agent',
    replacedBy: { title: 'the AI Toolkit', href: '/ai/ai-toolkit/overview' },
    migrate: {
      title: 'Migrate from AI Agent',
      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides/ai-assistant',
    },
  },
  {
    path: '/ai/deprecated/suggestion/',
    name: 'AI Suggestion',
    replacedBy: { title: 'the AI Toolkit', href: '/ai/ai-toolkit/overview' },
    migrate: {
      title: 'Migrate from AI Suggestion',
      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides/ai-suggestion',
    },
  },
  {
    path: '/ai/deprecated/changes/',
    name: 'AI Changes',
    replacedBy: { title: 'the AI Toolkit', href: '/ai/ai-toolkit/overview' },
    migrate: {
      title: 'Migrate from AI Changes',
      href: '/ai/ai-toolkit/client/advanced-guides/migration-guides/ai-changes',
    },
  },
  {
    path: '/ai/ai-toolkit/api-reference/rest-api-v3',
    name: 'the v3 endpoints',
    replacedBy: { title: 'the current REST API', href: '/ai/ai-toolkit/api-reference/rest-api' },
  },
  {
    path: '/ai/ai-toolkit/client/api-reference/diff-utility',
    name: 'the diff utility',
    replacedBy: { title: 'Tiptap Compare', href: '/compare/getting-started/overview' },
  },
  {
    path: '/ai/ai-toolkit/client/advanced-guides/compare-documents',
    name: 'this way of comparing documents',
    replacedBy: { title: 'Tiptap Compare', href: '/compare/getting-started/overview' },
  },
  {
    path: '/ai/ai-toolkit/client/advanced-guides/split-view',
    name: 'this split view',
    replacedBy: { title: 'the Split View extension', href: '/compare/guides/split-view' },
  },
  {
    path: '/ai/ai-toolkit/client/workflows/template',
    name: 'the template workflow',
    note: {
      text: 'If your use case involves templates and slot-filling,',
      link: { title: 'email us', href: 'mailto:humans@tiptap.dev' },
    },
  },
  {
    path: '/conversion/legacy/',
    name: 'the legacy conversion extensions and REST API',
    replacedBy: { title: 'Conversion', href: '/conversion/getting-started/overview' },
    migrate: { title: 'The migration guide', href: '/conversion/legacy/migration-guide' },
    removal: "They get no new features, and Tiptap gives 90 days' notice before it removes them.",
  },
  {
    path: '/conversion/legacy/markdown/',
    name: 'the legacy Markdown extensions and REST API',
    replacedBy: { title: 'Conversion', href: '/conversion/getting-started/overview' },
    migrate: { title: 'The migration guide', href: '/conversion/legacy/migration-guide' },
    removal: 'They will be removed in 2026, and the team will announce it first.',
  },
  {
    path: '/conversion/legacy/odt/',
    name: 'the legacy ODT extensions and REST API',
    replacedBy: { title: 'Conversion', href: '/conversion/getting-started/overview' },
    migrate: { title: 'The migration guide', href: '/conversion/legacy/migration-guide' },
    removal: 'They will be removed in 2026, and the team will announce it first.',
  },
  {
    path: '/collaboration/documents/snapshot-compare',
    name: 'Compare snapshots',
    replacedBy: { title: 'Tiptap Compare', href: '/compare/getting-started/overview' },
    migrate: { title: 'Compare versions', href: '/compare/guides/compare-versions' },
  },
  {
    path: '/authentication/legacy',
    name: 'App IDs and per-service secrets',
    replacedBy: { title: 'the current authentication', href: '/authentication' },
    migrate: { title: 'Migrate to the new authentication', href: '/authentication/migrate' },
  },
  {
    path: '/pages/',
    name: 'Pages',
    replacedBy: { title: 'Page Layout' },
  },
]

const covers = (path: string, route: string) =>
  path.endsWith('/') ? route.startsWith(path) : route === path

/** The legacy feature a page belongs to, if any. */
export function legacyFeature(route: string): LegacyFeature | undefined {
  return LEGACY_FEATURES.filter((feature) => covers(feature.path, route)).sort(
    (a, b) => b.path.length - a.path.length,
  )[0]
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** The box's text as Markdown, for the .md pages agents read. */
export function legacyMarkdown(
  feature: LegacyFeature,
  link: (href: string) => string, // eslint-disable-line no-unused-vars
): string {
  const parts = [`Existing projects can keep using ${feature.name}.`]
  const { replacedBy, migrate, note } = feature
  if (replacedBy?.href) {
    parts.push(`For new projects, use [${replacedBy.title}](${link(replacedBy.href)}).`)
  } else if (replacedBy) {
    parts.push(`${capitalize(replacedBy.title)} will replace it and is coming soon.`)
  }
  if (migrate) parts.push(`[${migrate.title}](${link(migrate.href)}) shows how to move.`)
  if (note) parts.push(`${note.text} [${note.link.title}](${link(note.link.href)}).`)
  if (feature.removal) parts.push(feature.removal)
  return `> **Legacy:** ${parts.join(' ')}`
}
