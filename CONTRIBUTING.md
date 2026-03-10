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
5. **Create a Changeset**: Run `pnpm changeset` to create a new changeset. Select the appropriate change type (patch, minor, or major) and write a meaningful message describing your changes.
6. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message. We recommend using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
7. **Push to Your Fork**: Push your changes to your fork on GitHub.
8. **Create a Pull Request**: Open a pull request to the `main` branch of the original repository. In the pull request, include:
   - A clear title that summarizes your changes.
   - If your PR documents a change in the [Tiptap repository](https://github.com/ueberdosis/tiptap), add a link to the PR in the Tiptap repository that introduced that change.
   - Add links to any issues or discussions that are related to your changes.
   - A detailed description of the changes you made.
   - Any relevant information that will help the maintainers understand your changes.
9. **Review and Merge**: Wait for a maintainer to review your changes. Once approved, your changes will be merged.

## Creating Versions

We use [changesets](https://github.com/changesets/changesets) for versioning. To create a new version, run `npx changeset version` in your terminal. This command will process all changesets (if the branch is not on a pre-release), create a new version, and update the `CHANGELOG.md` file accordingly.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project. For more details, please refer to the [LICENSE.md](LICENSE) file.

Thank you for helping us improve Tiptap's documentation!
