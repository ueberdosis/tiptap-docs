// The feature catalog: every page whose frontmatter has an `extension` block
// with a `group` appears in /editor/extensions/overview and, for editor
// groups, in the sidebar under Editor › Extensions. The order here is the
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
  { id: 'kits', title: 'Kits', area: 'editor' },
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
  { id: 'documents', title: 'Documents', area: 'platform' },
  { id: 'review', title: 'Review', area: 'platform' },
  { id: 'compare', title: 'Compare', area: 'platform' },
  { id: 'composable-docs', title: 'Composable Docs', area: 'platform' },
  { id: 'page-layout', title: 'Page layout', area: 'platform' },
  { id: 'conversion', title: 'Conversion', area: 'platform' },
  { id: 'ai', title: 'AI', area: 'platform' },
]

/** Plans in the order the filter shows them. A page's plan comes from its tags. */
export const CATALOG_PLANS = ['Open source', 'Start', 'Team', 'Add-on', 'Pilot program'] as const

export type CatalogPlan = (typeof CATALOG_PLANS)[number]
