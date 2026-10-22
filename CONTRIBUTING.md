# Contribution Guidelines

Thank you for your interest in contributing to the Tiptap documentation. We welcome contributions from everyone and appreciate your help in making our documentation even better.

## How to Contribute

To contribute, please follow these steps:

1. **Fork the Repository**: Start by [forking the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) and cloning it to your local machine.
2. **Create a New Branch**: Create a new branch for your changes to keep your work organized and separate from the main branch.
   - When naming your branch, please use the following format:
     - `fix/<description>` for fixes to the documentation (typos, incorrect information) or bugs in the website code.
     - `feature/<description>` for new features of the website or new content of the documentation.
3. **Make Your Changes**: Implement your changes or additions to the documentation.
4. **Test Your Changes**: Ensure your changes work correctly and do not introduce any issues.
   - Run the docs locally with the `pnpm dev` command. Preview the changes in your browser.
   - Run the linter with `pnpm lint` command.
5. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message. We recommend using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
6. **Push to Your Fork**: Push your changes to your fork on GitHub.
7. **Create a Pull Request**: Open a pull request to the `main` branch of the original repository. In the pull request, include:
   - A clear title that summarizes your changes.
   - If your PR documents a change in the [Tiptap repository](https://github.com/ueberdosis/tiptap), add a link to the PR in the Tiptap repository that introduced that change.
   - Add links to any issues or discussions that are related to your changes.
   - A detailed description of the changes you made.
   - Any relevant information that will help the maintainers understand your changes.
8. **Review and Merge**: Wait for a maintainer to review your changes. Once approved, your changes will be merged.

## Writing Pages

One text serves people and AI agents: every page is also served as Markdown and listed in `llms.txt`. Write it once, plainly.

### How a page reads

- Open with one or two sentences on what the feature does (`intro` in the frontmatter). Then the demo, then the smallest code that works.
- Put a demo under the heading whose topic it shows, after one sentence that says what to try in it. Each demo has one home; other pages link to it.
- One fact per sentence or bullet. Split a paragraph longer than about 60 words, or turn it into a list or a table.
- Use tables for things with the same shape: options (option, type, description), return values, what is stored where.
- Describe behavior as labeled bullets (`**Renaming a step** …`) under a heading that names the situation.
- Every command looks the same: a heading with its name, one sentence, an example, an options table, and one line on when it returns `false`.
- Headings are plain text that names a task or a thing. No code in headings.
- Say a thing once and link to it.
- Give every page a specific one-line `meta.description`. It becomes the meta description and the line in `llms.txt`; leave out "Learn more in our docs".

### Page types

| Type             | Use it for                                      | It holds                                                                                                                       |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Feature overview | The entry to a larger feature, such as Comments | `intro`, demo, "What you can do with it" with links into the details, "Get started" with access and minimal code, "Next steps" |
| Feature page     | One extension or one topic of a feature         | `intro`, demo, quick start, behavior, its commands, an options table                                                           |
| Install          | Getting a feature running                       | Requirements, install command, the smallest working setup, next steps                                                          |
| Chooser          | A decision between options, such as hosting     | A comparison table, a recommendation, then a section per option                                                                |
| Guide            | A task across several steps or features         | Goal, prerequisites, steps, result                                                                                             |
| API reference    | Looking things up                               | Tables and the command format above; little prose                                                                              |
| Example          | Showing a finished use                          | The demo first, a short explanation, links to the features it uses                                                             |

A feature overview starts like this:

```mdx
---
title: 'Comment on any part of a document'
intro: 'Comments lets people discuss a document in threads attached to the text they are about.'
tags:
  - type: start
meta:
  title: 'Comments | Tiptap Docs'
  description: 'Add comment threads to Tiptap documents, store them with the document, and manage them from your backend.'
  category: Comments
extension: { name, description, type, icon, group } # its catalog entry, see Feature Catalog
---

## What you can do with it

- **Discuss any part of a document.** Threads on text or nodes, inline or in a sidebar. [Manage threads](/comments/core-concepts/manage-threads)

## Get started

## Next steps
```

## Moving or Renaming Pages

A published URL has to keep working. When you move, rename or delete a page:

1. Add a redirect to `src/server/redirects.mjs` (`permanent: true`). Point it straight at the new page; don't chain redirects.
2. Update links in content and sidebars to the new URL.
3. Run `pnpm urls:update` after adding pages. It records new URLs in `tests/fixtures/known-urls.txt`. Never delete a line from that file.

## Sidebars

All documentation shares one sidebar, `src/content/sidebar.ts`; only UI Components keeps its own. Each section still describes its pages in its own `src/content/<section>/sidebar.ts`, and the global sidebar places those sections. A new section needs an entry in the global sidebar; `pnpm test:structure` fails until every page of a section sidebar appears there. A page that no sidebar links to belongs in `tests/fixtures/pages-outside-sidebar.txt`.

## Feature Catalog

The catalog at `/editor/extensions/overview` lists every page whose frontmatter has an `extension` block with a `group`. The groups, their order and their area (Editor or Document Platform) are in `src/content/catalog.ts`; editor groups also make up the sidebar under Features, next to the larger features such as Comments or Conversion, which keep their own sections. A page's plan comes from its `tags` (`start`, `team`, `addon`, `restricted`). A new extension page needs a `group`, or `pnpm test:structure` fails.

## Tests

- `pnpm test:structure` checks without a server that every known URL still reaches a page, that redirects end on pages, that sidebars and internal links point at real pages, and that `llms.txt` and the docs MCP server (`/api/mcp`) answer as expected. It runs on every pull request.
- `pnpm test:e2e` runs Playwright: every page and its `.md` version answer 200, every old URL redirects to a live page, and one page per page type renders without errors or serious accessibility violations. Locally, build first with `pnpm build:next`; the tests start the server. Against a deployed site, set `DOCS_TEST_URL` (including any base path). In CI they run against each Vercel deployment.
- `SMOKE_ALL=1 pnpm test:e2e` also loads every page in a browser.

## Publishing Documentation

The documentation is published automatically when changes are pushed to `main`. The docs do not have versioned releases, so contributions do not need a changeset or a version bump.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project. For more details, please refer to the [LICENSE.md](LICENSE) file.

Thank you for helping us improve Tiptap's documentation!
