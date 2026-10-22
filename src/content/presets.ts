// Starting points for "Plan your editor" (/configurator) and the MCP tool
// plan_editor. Features are catalog names (src/content/catalog.ts and the
// `extension.name` in each page's frontmatter); tests check that each exists.

export type EditorPreset = {
  id: string
  title: string
  description: string
  features: string[]
  /** A UI Components template that already builds this editor. */
  template?: { title: string; url: string }
  /** Features people often add to this kind of editor. */
  suggestions: string[]
}

export const EDITOR_PRESETS: EditorPreset[] = [
  {
    id: 'simple',
    title: 'Simple editor',
    description: 'Formatting, lists, links, images, and search, as in the Simple template.',
    features: [
      'Starter kit',
      'Highlight',
      'Text align',
      'Task list',
      'Task item',
      'Image',
      'Link',
      'Find and replace',
      'Selection',
      'Trailing node',
    ],
    template: { title: 'Simple template', url: '/ui-components/templates/simple-editor' },
    suggestions: ['Placeholder', 'Character count', 'Table kit', 'Mention', 'Typography'],
  },
  {
    id: 'notion',
    title: 'Notion-like editor',
    description:
      'Blocks you drag around, mentions, emoji, math, AI commands, and real-time editing.',
    features: [
      'Starter kit',
      'Highlight',
      'Color',
      'Superscript',
      'Subscript',
      'Text align',
      'Task list',
      'Task item',
      'Code block lowlight',
      'Mathematics',
      'Image',
      'Link',
      'Emoji',
      'Mention',
      'Bubble menu',
      'Drag handle React',
      'Collaboration',
      'Collaboration caret',
      'Basic AI Generation',
    ],
    template: { title: 'Notion-like template', url: '/ui-components/templates/notion-like-editor' },
    suggestions: [
      'Table kit',
      'Details',
      'Table of contents',
      'Comments',
      'Snapshots',
      'AI Toolkit',
    ],
  },
  {
    id: 'word',
    title: 'Word-like document editor',
    description: 'Pages with headers and footers, fonts and spacing, Word import and export.',
    features: [
      'Starter kit',
      'Pages',
      'Font family',
      'Font size',
      'Line height',
      'Color',
      'Text align',
      'Image',
      'Link',
      'Table kit',
      'DOCX import',
      'DOCX export',
      'PDF export',
      'Collaboration',
      'Collaboration caret',
    ],
    template: { title: 'DOCX Editor template', url: '/ui-components/templates/docx-editor' },
    suggestions: [
      'Tracked Changes',
      'Comments',
      'Compare',
      'Snapshots',
      'Find and replace',
      'ODT export',
    ],
  },
  {
    id: 'review',
    title: 'Review workflow',
    description: 'Suggest changes, discuss them, compare versions, and keep a history.',
    features: [
      'Starter kit',
      'Collaboration',
      'Collaboration caret',
      'Comments',
      'Tracked Changes',
      'Compare',
      'Snapshots',
    ],
    suggestions: ['Pages', 'DOCX import', 'DOCX export', 'AI Toolkit', 'Compare snapshots'],
  },
  {
    id: 'ai',
    title: 'AI writing assistant',
    description: 'An agent that edits the document, with its changes as suggestions to review.',
    features: ['Starter kit', 'AI Toolkit', 'Tracked Changes', 'Comments'],
    suggestions: ['Basic AI Generation', 'Snapshots', 'Compare', 'Collaboration'],
  },
  {
    id: 'collaboration',
    title: 'Real-time collaboration',
    description: 'Several people in one document, with presence, history, and comments.',
    features: ['Starter kit', 'Collaboration', 'Collaboration caret', 'Snapshots', 'Comments'],
    suggestions: ['Tracked Changes', 'Compare', 'Mention', 'Basic AI Generation'],
  },
  {
    id: 'templates',
    title: 'Document templates',
    description: 'Fields to fill, values from your data, and parts that only some may edit.',
    features: ['Starter kit', 'Slots', 'Variables', 'Content Protection'],
    suggestions: ['Pages', 'PDF export', 'DOCX export', 'Compare', 'Tracked Changes'],
  },
]

/** What a feature needs besides the editor, as its pages document it. */
export type ServiceNeed = 'document-server' | 'sync-server' | 'tiptap-service'

export const SERVICE_NEEDS: Record<string, ServiceNeed> = {
  Collaboration: 'sync-server',
  'Collaboration caret': 'sync-server',
  Comments: 'document-server',
  Snapshots: 'document-server',
  'Compare snapshots': 'document-server',
  'AI Toolkit': 'tiptap-service',
  'Basic AI Generation': 'tiptap-service',
  'DOCX import': 'tiptap-service',
  'PDF export': 'tiptap-service',
}
