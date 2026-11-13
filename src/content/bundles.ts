/**
 * Bundles: a licensed, tested set of features for one use case, installed as
 * one package. Each part keeps its own page under Features; the bundle page
 * lists the parts from here, with name, status, and plan from the catalog.
 *
 * MOCK: the DOCX bundle is a draft. Its name, package, plan, and parts wait for
 * the team's decision (see the bundles concept); keep it in sync with the
 * catalog's upcoming features until then.
 */

export type Bundle = {
  id: string
  title: string
  /** What people build with it, in a few words. */
  description: string
  /** The page that describes it. */
  url: string
  /** The npm package to install. */
  package: string
  /** Soon until its parts are released. */
  status: 'Soon' | 'Alpha' | 'Beta'
  /** Catalog names of the features it installs and licenses. */
  parts: string[]
}

export const BUNDLES: Bundle[] = [
  {
    id: 'docx',
    title: 'DOCX bundle',
    description:
      'A Word-like editor: documents on pages, with footnotes and references, to and from .docx.',
    url: '/bundles/docx',
    package: '@tiptap-pro/docx',
    status: 'Soon',
    parts: [
      'Page Layout',
      'Footnotes',
      'Cross-references',
      'Outline numbering',
      'Bookmark',
      'Document styles',
      'Whole blocks',
      // Formatting, set up so the defaults match Word
      'Font family',
      'Font size',
      'Line height',
      'Color',
      'Highlight',
      'Text align',
      'Underline',
      'Subscript',
      'Superscript',
      'Comments',
      'Tracked Changes',
      'DOCX import',
      'DOCX export',
      'PDF export',
    ],
  },
]

export function findBundle(id: string): Bundle | undefined {
  return BUNDLES.find((bundle) => bundle.id === id)
}
