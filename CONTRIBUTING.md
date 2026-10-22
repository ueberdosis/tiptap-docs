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

- `pnpm test:structure` checks without a server that every known URL still reaches a page, that redirects end on pages, and that sidebars and internal links point at real pages. It runs on every pull request.
- `pnpm test:e2e` runs Playwright: every page and its `.md` version answer 200, every old URL redirects to a live page, and one page per page type renders without errors or serious accessibility violations. Locally, build first with `pnpm build:next`; the tests start the server. Against a deployed site, set `DOCS_TEST_URL` (including any base path). In CI they run against each Vercel deployment.
- `SMOKE_ALL=1 pnpm test:e2e` also loads every page in a browser.

## Publishing Documentation

The documentation is published automatically when changes are pushed to `main`. The docs do not have versioned releases, so contributions do not need a changeset or a version bump.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project. For more details, please refer to the [LICENSE.md](LICENSE) file.

Thank you for helping us improve Tiptap's documentation!
