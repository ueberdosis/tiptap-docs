---
name: tiptap-integration
description: Helps coding agents integrate and work with the Tiptap rich text editor. Use when building or modifying a rich text editor with Tiptap, installing Tiptap extensions, or implementing features like collaboration, comments, AI, or document conversion.
compatibility: Requires git and Node.js
metadata:
  author: tiptap
  version: "1.0"
---

# Tiptap Integration Skill

Instructions for coding agents integrating the Tiptap rich text editor

## Reference Repositories

Clone the tiptap and tiptap-docs repositories so you can search the source code and documentation.
- https://github.com/ueberdosis/tiptap
- https://github.com/ueberdosis/tiptap-docs

If the workspace already has a reference folder with other repositories, clone them there.

Otherwise, clone the repositories in a new `.reference` folder. The reference folder should be git-ignored.

Before you start a task, make sure the repositories are updated to the latest version.

## Best Practices

### General

- Use the latest stable version of **Tiptap 3**.
- All packages that start with `@tiptap/` must have the **same version number**.
- When integrating Tiptap for the first time, read the corresponding installation guide in tiptap-docs.
- When server-side rendering (e.g. Next.js), set the `immediatelyRender: false` option when initializing the editor. Otherwise, the editor will crash. Learn more about this in tiptap-docs.

### React

- Prefer using the React Composable API. See `guides/react-composable-api`

## Implementing Editor Features

When the user asks you to implement one of these features, read the corresponding section in tiptap-docs for guidance.

- **Real-time collaboration** — Multiple users editing a document simultaneously. See `collaboration/` in tiptap-docs.
- **Comments** — Thread-based inline and document comments. See `comments/` in tiptap-docs.
- **Tracked changes** — Track, accept, and reject document edits. See `tracked-changes/` in tiptap-docs.
- **Import/Export** — Convert documents to and from DOCX, PDF, Markdown, and other formats. See `conversion/` in tiptap-docs.
- **AI content generation** — Generate text content into the document using AI. See `content-ai/capabilities/ai-toolkit/workflows/insert-content` in tiptap-docs.
- **AI agent document editing** — Give an AI agent the ability to edit Tiptap documents. See `content-ai/capabilities/ai-toolkit/` in tiptap-docs.
- **AI review and proofreading** — Review, proofread, and suggest style improvements. See `content-ai/capabilities/ai-toolkit/workflows/proofreader` in tiptap-docs.
- **AI server-side processing** — Run AI workflows that edit rich text documents on the server. See `content-ai/capabilities/server-ai-toolkit/` in tiptap-docs.
- **Version history** — Save and restore document snapshots. See `collaboration/documents/snapshot` in tiptap-docs.
- **Snapshot compare** — Highlight differences between document versions. See `collaboration/documents/snapshot-compare` in tiptap-docs.
- **Pages** — Print-ready page layout with headers, footers, and page breaks. See `pages/` in tiptap-docs.

## Pro Extensions

Some Tiptap extensions are distributed through a private npm registry. To install pro packages, see `guides/pro-extensions` in tiptap-docs for setup instructions.
