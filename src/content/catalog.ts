// The feature catalog: every page whose frontmatter has an `extension` block
// with a `group` appears in /editor/extensions/overview and, for editor
// groups, in the sidebar under Features. The order here is the
// order on the page and in the sidebar.

export type CatalogArea = 'editor' | 'platform'

export type CatalogGroup = {
  id: string
  title: string
  area: CatalogArea
  /** Labels the group Paid in the sidebar even when not every feature in it says so. */
  paid?: boolean
}

/** A group of editor features that has its own page, `/editor/extensions/<id>`. */
export function catalogGroupUrl(group: CatalogGroup): string | undefined {
  return group.area === 'editor' && group.id !== 'kits'
    ? `/editor/extensions/${group.id}`
    : undefined
}

export const CATALOG_AREAS: Record<CatalogArea, string> = {
  editor: 'Editor',
  platform: 'Document Platform',
}

export const CATALOG_GROUPS: CatalogGroup[] = [
  // Paid products and paid editor groups first, as in the sidebar, then the open source editor's groups
  { id: 'ai', title: 'AI', area: 'platform' },
  { id: 'review', title: 'Review', area: 'platform' },
  { id: 'compare', title: 'Compare', area: 'platform' },
  { id: 'conversion', title: 'Conversion', area: 'platform' },
  { id: 'composable-docs', title: 'Composable Documents', area: 'platform' },
  { id: 'page-layout', title: 'Page Layout', area: 'platform' },
  { id: 'whiteboard', title: 'Whiteboard', area: 'platform' },
  // Editor features that will need a plan, with the paid products
  { id: 'document-structure', title: 'Document structure', area: 'editor' },
  { id: 'kits', title: 'Starter kit', area: 'editor' },
  { id: 'text-formatting', title: 'Text formatting', area: 'editor' },
  { id: 'text-styling', title: 'Text styling', area: 'editor' },
  { id: 'text-blocks', title: 'Text blocks', area: 'editor' },
  { id: 'lists', title: 'Lists', area: 'editor' },
  { id: 'tables', title: 'Tables', area: 'editor' },
  { id: 'code-and-math', title: 'Code and math', area: 'editor' },
  { id: 'media', title: 'Media and embeds', area: 'editor' },
  { id: 'mentions-and-emoji', title: 'Mentions and emoji', area: 'editor' },
  { id: 'menus', title: 'Menus and handles', area: 'editor' },
  { id: 'cursor-and-selection', title: 'Cursor and selection', area: 'editor' },
  { id: 'writing-helpers', title: 'Writing helpers', area: 'editor' },
  { id: 'document-helpers', title: 'Document helpers', area: 'editor' },
  { id: 'clipboard-and-files', title: 'Clipboard and files', area: 'editor' },
  { id: 'collaboration', title: 'Real-time collaboration', area: 'editor' },
  // Snapshots belong to the Document Server, under Platform in the sidebar
  { id: 'documents', title: 'Documents', area: 'platform' },
]

/** Plans in the order the filter shows them. A page's plan comes from its tags. */
export const CATALOG_PLANS = ['Open source', 'Start', 'Team', 'Add-on', 'Pilot program'] as const

export type CatalogPlan = (typeof CATALOG_PLANS)[number]

/** How the page header, the catalog cards, and the plan filter name each plan. */
export const PLAN_LABELS: Record<CatalogPlan, { label: string; tooltip: string }> = {
  'Open source': { label: 'Open source', tooltip: 'MIT licensed, free to use.' },
  Start: { label: 'Start plan', tooltip: 'Included in Start, Team, Business, and Enterprise.' },
  Team: { label: 'Team plan', tooltip: 'Included in Team, Business, and Enterprise.' },
  'Add-on': { label: 'Paid add-on', tooltip: 'Added to a paid plan.' },
  'Pilot program': {
    label: 'Pilot program',
    tooltip: 'Contact our team to join the pilot program.',
  },
}

/** The statuses to filter by; Stable is a released feature without a status. */
export const CATALOG_STATUSES = [
  'Stable',
  'Beta',
  'Alpha',
  'Experimental',
  'Soon',
  'Legacy',
  'Deprecated',
] as const

export type UpcomingFeature = {
  name: string
  description: string
  icon: string
  group: string
  /** What covers the need today, until the feature ships. */
  meanwhile?: { label: string; url: string }
  /** Will need a paid plan; which one is set when its docs ship. */
  paid?: boolean
}

/**
 * MOCK: packages that exist in tiptap-pro but have no docs pages yet: Page Layout
 * and the extensions that come with it. They show as "Soon" in the catalog
 * and the sidebar. Replace an entry with a page (frontmatter `extension.group`)
 * once its docs exist; drop the list before it ships if the packages aren't
 * announced.
 */
export const UPCOMING_FEATURES: UpcomingFeature[] = [
  {
    name: 'Page Layout',
    description:
      'Lay out a document as pages, with page formats, sections, headers and footers, page numbers, and breaks.',
    icon: 'FileText',
    group: 'page-layout',
    meanwhile: { label: 'Pages', url: '/pages/getting-started/overview' },
    paid: true,
  },
  {
    name: 'Footnotes',
    description: 'Footnotes and endnotes that number themselves, in any editor.',
    icon: 'Superscript',
    group: 'document-structure',
    meanwhile: { label: 'footnotes in Pages', url: '/pages/core-concepts/footnotes' },
    paid: true,
  },
  {
    name: 'Cross-references',
    description: 'Refer to headings, clauses, or bookmarks with references that stay up to date.',
    icon: 'Link2',
    group: 'document-structure',
    paid: true,
  },
  {
    name: 'Outline numbering',
    description: 'Number headings and clauses as 1.1, Article I, or (a), from where they stand.',
    icon: 'ListTree',
    group: 'document-structure',
    paid: true,
  },
  {
    name: 'Document styles',
    description:
      'Named styles for paragraphs, headings, and tables, stored in the document; change a style and everything using it follows.',
    icon: 'Paintbrush',
    group: 'document-structure',
    paid: true,
  },
  {
    name: 'Bookmark',
    description: 'Named places in the document that links and references can point to.',
    icon: 'Bookmark',
    group: 'document-structure',
    paid: true,
  },
  {
    name: 'Columns',
    description: 'Containers side by side, each with content of its own.',
    icon: 'Columns2',
    group: 'document-structure',
    paid: true,
  },
  {
    name: 'Whole blocks',
    description: 'A block selected from start to end is deleted, cut, and copied as a block.',
    icon: 'Square',
    group: 'cursor-and-selection',
    paid: true,
  },
]
