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
