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
  { id: 'kits', title: 'Starter kit', area: 'editor' },
  { id: 'text-formatting', title: 'Text formatting', area: 'editor' },
  { id: 'text-styling', title: 'Text styling', area: 'editor' },
  { id: 'text-blocks', title: 'Text blocks', area: 'editor' },
  { id: 'lists', title: 'Lists', area: 'editor' },
  { id: 'tables', title: 'Tables', area: 'editor' },
  { id: 'document-structure', title: 'Document structure', area: 'editor' },
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
  { id: 'whiteboard', title: 'Whiteboard', area: 'platform' },
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
  /** What covers the need today, until the feature ships. */
  meanwhile?: { label: string; url: string }
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
  },
  {
    name: 'Footnotes',
    description: 'Footnotes and endnotes that number themselves, in any editor.',
    icon: 'Superscript',
    group: 'document-structure',
    meanwhile: { label: 'footnotes in Pages', url: '/pages/core-concepts/footnotes' },
  },
  {
    name: 'Cross-references',
    description: 'Refer to headings, clauses, or bookmarks with references that stay up to date.',
    icon: 'Link2',
    group: 'document-structure',
  },
  {
    name: 'Outline numbering',
    description: 'Number headings and clauses as 1.1, Article I, or (a), from where they stand.',
    icon: 'ListTree',
    group: 'document-structure',
  },
  {
    name: 'Document styles',
    description:
      'Named styles for paragraphs, headings, and tables, stored in the document; change a style and everything using it follows.',
    icon: 'Paintbrush',
    group: 'document-structure',
  },
  {
    name: 'Bookmark',
    description: 'Named places in the document that links and references can point to.',
    icon: 'Bookmark',
    group: 'document-structure',
  },
  {
    name: 'Number formats',
    description: 'One set of number formats for page numbers, notes, and outline numbers.',
    icon: 'ListOrdered',
    group: 'document-structure',
    meanwhile: {
      label: 'list numbering in DOCX export',
      url: '/conversion/export/docx/ordered-list-numbering',
    },
  },
  {
    name: 'Columns',
    description: 'Containers side by side, each with content of its own.',
    icon: 'Columns2',
    group: 'document-structure',
  },
  {
    name: 'Whole blocks',
    description: 'A block selected from start to end is deleted, cut, and copied as a block.',
    icon: 'Square',
    group: 'cursor-and-selection',
  },
]
