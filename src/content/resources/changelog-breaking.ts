// How to deal with a breaking change, written by hand in a fixed outline:
// what changes, who is affected, how to migrate. The changelog shows it under
// the change it matches. Add one for every Breaking (major) change that asks
// readers to change their code.

export type BreakingNote = {
  /** The change it explains: its version, the start of its text, and its packages. */
  match: {
    version: string
    startsWith: string
    /** Package names, or a scope such as `@tiptap/` for every open source package. */
    packages: string[] | { scope: string }
  }
  /** What changes, in one or two sentences. */
  what: string
  /** Who has to act. */
  who: string
  /** What to do. Markdown. */
  migrate: string
  /** A page with the details, if there is one. */
  url?: string
}

export const BREAKING_NOTES: BreakingNote[] = [
  {
    match: {
      version: '3.0.1',
      startsWith: 'We are now building packages with tsup',
      packages: { scope: '@tiptap/' },
    },
    what: 'Tiptap packages ship as ES modules and CommonJS only, no longer as UMD builds.',
    who: 'Projects that load Tiptap from a UMD bundle, for example with a script tag from a CDN.',
    migrate:
      'Import the packages with a bundler, or load the ES modules from a CDN that serves them, such as esm.sh. To keep a single file, bundle Tiptap yourself.',
    url: '/resources/whats-new',
  },
  {
    match: {
      version: '3.0.1',
      startsWith: '`getPos` in `NodeViewRendererProps`',
      packages: ['@tiptap/core'],
    },
    what: '`getPos` in a node view can return `undefined` when the node is no longer in the document.',
    who: 'Custom node views that read their position with `getPos()`.',
    migrate:
      'Check the result before you use it: `const pos = getPos(); if (pos === undefined) return`.',
    url: '/editor/extensions/custom-extensions/node-views',
  },
  {
    match: {
      version: '3.0.0',
      startsWith: 'Renamed `@tiptap-pro/extension-collaboration-history`',
      packages: ['@tiptap-pro/extension-snapshot'],
    },
    what: 'The `@tiptap-pro/extension-collaboration-history` package is now `@tiptap-pro/extension-snapshot`.',
    who: 'Projects that use Collaboration History to keep versions of a document.',
    migrate:
      'Install `@tiptap-pro/extension-snapshot`, remove the old package, and change your imports to the new package name.',
    url: '/collaboration/documents/snapshot',
  },
]
