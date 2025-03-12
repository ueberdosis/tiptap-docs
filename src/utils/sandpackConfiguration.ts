import { SandpackFiles } from '@codesandbox/sandpack-react'
import { nightOwl } from '@codesandbox/sandpack-themes'

export const sandpackTheme = nightOwl

export const defaultFiles: SandpackFiles = {
  'styles.css': {
    hidden: true,
    code: `
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.tiptap {
  > * + * {
    margin-top: 1rem;
  }
}

:root {
  font-size: 16px;
}

body {
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  padding: 1rem;
}

a {
  color: #68cef8;
}

mark {
  background-color: #ffe066;
  border-radius: 0.25em;
  box-decoration-break: clone;
  padding: 0.125em 0;
}

code {
  background-color: rgba(#616161, 0.1);
  border-radius: 0.25em;
  box-decoration-break: clone;
  color: #616161;
  font-size: 0.9rem;
  padding: 0.25em;
}

.Prosemirror {
  background-color: white;
  color: black;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.toolbar--button {
  background: black;
  border-radius: 0.25rem;
  color: white;
  padding: 0.25rem;
}

`
      .trimStart()
      .trimEnd(),
  },
}

export const dependencies = {
  '@tiptap/react': 'next',
  '@tiptap/starter-kit': 'next',
  '@tiptap/pm': 'next',
  '@tiptap/core': 'next',
  '@tiptap/html': 'next',
  '@tiptap/suggestion': 'next',
  '@tiptap/vue-2': 'next',
  '@tiptap/vue-3': 'next',
  '@tiptap/extension-blockquote': 'next',
  '@tiptap/extension-bold': 'next',
  '@tiptap/extension-bubble-menu': 'next',
  '@tiptap/extension-bullet-list': 'next',
  '@tiptap/extension-character-count': 'next',
  '@tiptap/extension-code-block-lowlight': 'next',
  '@tiptap/extension-code-block': 'next',
  '@tiptap/extension-code': 'next',
  '@tiptap/extension-collaboration-caret': 'next',
  '@tiptap/extension-collaboration': 'next',
  '@tiptap/extension-color': 'next',
  '@tiptap/extension-document': 'next',
  '@tiptap/extension-dropcursor': 'next',
  '@tiptap/extension-floating-menu': 'next',
  '@tiptap/extension-focus': 'next',
  '@tiptap/extension-font-family': 'next',
  '@tiptap/extension-gapcursor': 'next',
  '@tiptap/extension-hard-break': 'next',
  '@tiptap/extension-heading': 'next',
  '@tiptap/extension-highlight': 'next',
  '@tiptap/extension-undo-redo': 'next',
  '@tiptap/extension-horizontal-rule': 'next',
  '@tiptap/extension-image': 'next',
  '@tiptap/extension-italic': 'next',
  '@tiptap/extension-link': 'next',
  '@tiptap/extension-list-item': 'next',
  '@tiptap/extension-list-keymap': 'next',
  '@tiptap/extension-mention': 'next',
  '@tiptap/extension-ordered-list': 'next',
  '@tiptap/extension-paragraph': 'next',
  '@tiptap/extension-placeholder': 'next',
  '@tiptap/extension-strike': 'next',
  '@tiptap/extension-subscript': 'next',
  '@tiptap/extension-superscript': 'next',
  '@tiptap/extension-table-cell': 'next',
  '@tiptap/extension-table-header': 'next',
  '@tiptap/extension-table-row': 'next',
  '@tiptap/extension-table': 'next',
  '@tiptap/extension-task-item': 'next',
  '@tiptap/extension-task-list': 'next',
  '@tiptap/extension-text-align': 'next',
  '@tiptap/extension-text-style': 'next',
  '@tiptap/extension-text': 'next',
  '@tiptap/extension-typography': 'next',
  '@tiptap/extension-underline': 'next',
  '@tiptap/extension-youtube': 'next',
}

export const proDependencies = {
  '@tiptap-pro/extension-ai': 'next',
  '@tiptap-pro/extension-annotation': 'next',
  '@tiptap-pro/extension-collaboration-history': 'next',
  '@tiptap-pro/extension-comments': 'next',
  '@tiptap-pro/extension-details-content': 'next',
  '@tiptap-pro/extension-details-summary': 'next',
  '@tiptap-pro/extension-details': 'next',
  '@tiptap-pro/extension-drag-handle-react': 'next',
  '@tiptap-pro/extension-drag-handle': 'next',
  '@tiptap-pro/extension-emoji': 'next',
  '@tiptap-pro/extension-file-handler': 'next',
  '@tiptap-pro/extension-iframely': 'next',
  '@tiptap-pro/extension-invisible-characters': 'next',
  '@tiptap-pro/extension-mathematics': 'next',
  '@tiptap-pro/extension-node-range': 'next',
  '@tiptap-pro/extension-table-of-contents': 'next',
  '@tiptap-pro/extension-unique-id': 'next',
}
