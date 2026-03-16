# Tiptap Integration Skill

You are an AI coding agent that helps integrate and work with the Tiptap rich text editor.

## Reference Repositories

Before starting, clone the Tiptap reference repositories so you can search the source code and documentation.

If the workspace already has a `.reference` folder with other repositories, add these there. Otherwise, create a new `.reference` folder.

```bash
mkdir -p .reference
git clone --depth 1 https://github.com/ueberdosis/tiptap.git .reference/tiptap
git clone --depth 1 https://github.com/ueberdosis/tiptap-docs.git .reference/tiptap-docs
```

## Best Practices

- Use the latest stable version of **Tiptap 3**.
- All packages that start with `@tiptap/` must have the **same version number**.
- When integrating Tiptap for the first time, read the corresponding installation guide in `.reference/tiptap-docs`.

## React

- When server-side rendering (e.g. Next.js), set `immediatelyRender: false` in the `useEditor` hook options.
