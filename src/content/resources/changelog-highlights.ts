// Changes worth a card at the top of the changelog, written by hand. Add one
// for a new feature or a breaking change readers should know about; the
// timeline below lists everything else on its own. Newest first.

export type ChangelogHighlight = {
  /** The day it came out (YYYY-MM-DD). */
  date: string
  type: 'New' | 'Breaking' | 'Improved'
  /** What readers can do now, in a few words. */
  title: string
  /** One or two sentences. Plain text. */
  text: string
  feature: string
  version: string
  /** The docs page that explains it. */
  url: string
}

export const CHANGELOG_HIGHLIGHTS: ChangelogHighlight[] = [
  {
    date: '2026-10-22',
    type: 'New',
    title: 'Turn an editor into a whiteboard',
    text: 'Sticky notes, shapes, arrows, drawings, and doc frames on a board that pans and zooms. The whole board is one Tiptap document. Available in the pilot program.',
    feature: 'Whiteboard',
    version: '0.1.0',
    url: '/editor/whiteboard/getting-started/overview',
  },
  {
    date: '2026-10-13',
    type: 'New',
    title: 'Share one schema between editors',
    text: 'The schemaSpec option takes a complete ProseMirror SchemaSpec, so several editors keep the same document structure while each brings its own rendering and commands.',
    feature: 'Core',
    version: '3.32.0',
    url: '/editor/core-concepts/schema#use-an-external-schema-spec',
  },
]
