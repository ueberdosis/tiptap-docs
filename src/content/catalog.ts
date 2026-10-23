// The feature catalog: every page whose frontmatter has an `extension` block
// with a `group` appears in /editor/extensions/overview and, for editor
// groups, in the sidebar under Features. The order here is the
// order on the page and in the sidebar.

export type CatalogArea = 'editor' | 'platform'

export type CatalogGroup = {
  id: string
  title: string
  area: CatalogArea
}

export const CATALOG_AREAS: Record<CatalogArea, string> = {
  editor: 'Editor',
  platform: 'Document Platform',
}

export const CATALOG_GROUPS: CatalogGroup[] = [
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
  { id: 'review', title: 'Review', area: 'platform' },
  { id: 'compare', title: 'Compare', area: 'platform' },
  { id: 'composable-docs', title: 'Composable Documents', area: 'platform' },
  { id: 'page-layout', title: 'Page Layout', area: 'platform' },
  { id: 'conversion', title: 'Conversion', area: 'platform' },
  { id: 'ai', title: 'AI', area: 'platform' },
  // Snapshots belong to the Document Server, under Platform in the sidebar
  { id: 'documents', title: 'Documents', area: 'platform' },
]

/** Plans in the order the filter shows them. A page's plan comes from its tags. */
export const CATALOG_PLANS = ['Open source', 'Start', 'Team', 'Add-on', 'Pilot program'] as const

export type CatalogPlan = (typeof CATALOG_PLANS)[number]

export type UpcomingFeature = {
  name: string
  description: string
  icon: string
  group: string
}

/**
 * MOCK: Page Layout packages that exist in tiptap-pro but have no docs pages yet. They show
 * as "Coming soon" in the catalog and the sidebar. Replace an entry with a page
 * (frontmatter `extension.group`) once its docs exist; drop the list before it
 * ships if the packages aren't announced.
 */
export const UPCOMING_FEATURES: UpcomingFeature[] = [
  {
    name: 'Bookmark',
    description: 'Named anchors in the document that links and references can point to.',
    icon: 'Bookmark',
    group: 'page-layout',
  },
  {
    name: 'Columns',
    description: 'Lay out content in side-by-side columns.',
    icon: 'Columns2',
    group: 'page-layout',
  },
  {
    name: 'Cross-references',
    description: 'Refer to headings, figures, or bookmarks with references that stay up to date.',
    icon: 'Link2',
    group: 'page-layout',
  },
  {
    name: 'Document styles',
    description: 'Define paragraph and character styles once for the whole document.',
    icon: 'Paintbrush',
    group: 'page-layout',
  },
  {
    name: 'Footnotes',
    description: 'Add numbered footnotes that renumber themselves as the text changes.',
    icon: 'Superscript',
    group: 'page-layout',
  },
  {
    name: 'Number formats',
    description: 'Number lists and headings as 1.1, a), i., or in your own format.',
    icon: 'ListOrdered',
    group: 'page-layout',
  },
  {
    name: 'Outline numbering',
    description: 'Number headings as a legal or technical outline, like 1, 1.1, 1.1.1.',
    icon: 'ListTree',
    group: 'page-layout',
  },
  {
    name: 'Whole blocks',
    description: 'Select, move, and delete a block as one unit.',
    icon: 'Square',
    group: 'page-layout',
  },
]
