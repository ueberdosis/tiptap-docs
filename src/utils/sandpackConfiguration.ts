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
  '@tiptap/react': 'latest',
  '@tiptap/starter-kit': 'latest',
  '@tiptap/pm': 'latest',
  '@tiptap/core': 'latest',
  '@tiptap/html': 'latest',
  '@tiptap/suggestion': 'latest',
  '@tiptap/vue-2': 'latest',
  '@tiptap/vue-3': 'latest',
  '@tiptap/extension-blockquote': 'latest',
  '@tiptap/extension-bold': 'latest',
  '@tiptap/extension-bubble-menu': 'latest',
  '@tiptap/extension-bullet-list': 'latest',
  '@tiptap/extension-character-count': 'latest',
  '@tiptap/extension-code-block-lowlight': 'latest',
  '@tiptap/extension-code-block': 'latest',
  '@tiptap/extension-code': 'latest',
  '@tiptap/extension-collaboration-cursor': 'latest',
  '@tiptap/extension-collaboration': 'latest',
  '@tiptap/extension-color': 'latest',
  '@tiptap/extension-document': 'latest',
  '@tiptap/extension-dropcursor': 'latest',
  '@tiptap/extension-floating-menu': 'latest',
  '@tiptap/extension-focus': 'latest',
  '@tiptap/extension-font-family': 'latest',
  '@tiptap/extension-gapcursor': 'latest',
  '@tiptap/extension-hard-break': 'latest',
  '@tiptap/extension-heading': 'latest',
  '@tiptap/extension-highlight': 'latest',
  '@tiptap/extension-history': 'latest',
  '@tiptap/extension-horizontal-rule': 'latest',
  '@tiptap/extension-image': 'latest',
  '@tiptap/extension-italic': 'latest',
  '@tiptap/extension-link': 'latest',
  '@tiptap/extension-list-item': 'latest',
  '@tiptap/extension-list-keymap': 'latest',
  '@tiptap/extension-mention': 'latest',
  '@tiptap/extension-ordered-list': 'latest',
  '@tiptap/extension-paragraph': 'latest',
  '@tiptap/extension-placeholder': 'latest',
  '@tiptap/extension-strike': 'latest',
  '@tiptap/extension-subscript': 'latest',
  '@tiptap/extension-superscript': 'latest',
  '@tiptap/extension-table-cell': 'latest',
  '@tiptap/extension-table-header': 'latest',
  '@tiptap/extension-table-row': 'latest',
  '@tiptap/extension-table': 'latest',
  '@tiptap/extension-task-item': 'latest',
  '@tiptap/extension-task-list': 'latest',
  '@tiptap/extension-text-align': 'latest',
  '@tiptap/extension-text-style': 'latest',
  '@tiptap/extension-text': 'latest',
  '@tiptap/extension-typography': 'latest',
  '@tiptap/extension-underline': 'latest',
  '@tiptap/extension-youtube': 'latest',
  '@tiptap/extension-details-content': 'latest',
  '@tiptap/extension-details-summary': 'latest',
  '@tiptap/extension-details': 'latest',
  '@tiptap/extension-drag-handle-react': 'latest',
  '@tiptap/extension-drag-handle': 'latest',
  '@tiptap/extension-emoji': 'latest',
  '@tiptap/extension-file-handler': 'latest',
  '@tiptap/extension-invisible-characters': 'latest',
  '@tiptap/extension-mathematics': 'latest',
  '@tiptap/extension-node-range': 'latest',
  '@tiptap/extension-table-of-contents': 'latest',
  '@tiptap/extension-unique-id': 'latest',
}

export const proDependencies = {
  '@tiptap-pro/extension-ai-advanced': 'latest',
  '@tiptap-pro/extension-ai': 'latest',
  '@tiptap-pro/extension-annotation': 'latest',
  '@tiptap-pro/extension-collaboration-history': 'latest',
  '@tiptap-pro/extension-comments': 'latest',
  '@tiptap-pro/extension-iframely': 'latest',
}
