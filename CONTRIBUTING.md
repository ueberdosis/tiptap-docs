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

## Feature Catalog

The catalog at `/editor/extensions/overview` lists every page whose frontmatter has an `extension` block with a `group`. The groups, their order, and their area (Editor or Document Platform) are in `src/content/catalog.ts`; editor groups also make up the sidebar under Features, next to the larger features such as Comments or Conversion, which keep their own sections. A page's plan comes from its `tags`. A new extension page needs a `group` and its npm `package`, as its install command names them.

Industries for the catalog filter are in `src/content/industries.ts`; each lists the features that matter most there, by catalog name.

## Labels

- **Plan and status come from the feature.** Tag the feature's overview page in its frontmatter (`start`, `team`, `addon`, `restricted`, `mit`; `alpha`, `beta`, `legacy`). Its pages inherit the plan and status through the sidebar and show them in the page header. Tag a page only when it differs from its feature, such as a Team page inside a Start feature.
- **The sidebar shows one grey label per entry**, in this order: Legacy, Paid, New. Paid stands for any plan, add-on, or the pilot program; the page header names which. A group says Paid when all its entries are paid, and the entries below a paid one don't repeat it; a group that mixes free and paid features says nothing, only its paid entries do. Open source stays unlabeled. Alpha and Beta show in the page header, not in the sidebar.
- **"New" carries a date and goes away after 90 days.** In frontmatter, `- type: new` with `since: '2026-10-01'`; in a sidebar, `newSince: '2026-10-01'` on the entry.
- **Legacy is the one end-of-life label.** It means: kept for existing projects, not for new ones. Tag the page `- type: legacy` and add the feature to `src/content/legacy.ts` with what replaces it, how to move, and when it goes away if that is decided; every page of the feature then shows that in a box under the header. Move its entry to the Legacy area at the end of `src/content/sidebar.ts`; its URLs stay.

## Publishing Documentation

The documentation is published automatically when changes are pushed to `main`. The docs do not have versioned releases, so contributions do not need a changeset or a version bump.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project. For more details, please refer to the [LICENSE.md](LICENSE) file.

Thank you for helping us improve Tiptap's documentation!
