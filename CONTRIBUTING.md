# Contribution Guidelines

Thank you for your interest in contributing to the Tiptap documentation. We welcome contributions from everyone and appreciate your help in making our documentation even better.

## How to Contribute

To contribute, please follow these steps:

1. **Fork the Repository**: Start by forking the repository and cloning it to your local machine.
2. **Create a New Branch**: Create a new branch for your changes to keep your work organized and separate from the main branch.
3. **Make Your Changes**: Implement your changes or additions to the documentation.
4. **Test Your Changes**: Ensure your changes work correctly and do not introduce any issues.
5. **Create a Changeset**: Run `npx changeset` to create a new changeset. Select the appropriate change type (patch, minor, or major) and write a meaningful message describing your changes.
6. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message.
7. **Push to Your Fork**: Push your changes to your fork on GitHub.
8. **Create a Pull Request**: Open a pull request to the `main` branch of the original repository. Provide a detailed description of your changes in the pull request.
9. **Review and Merge**: Wait for a maintainer to review your changes. Once approved, your changes will be merged.

## Creating Versions

We use [changesets](https://github.com/changesets/changesets) for versioning. To create a new version, run `npx changeset version` in your terminal. This command will process all changesets (if the branch is not on a pre-release), create a new version, and update the `CHANGELOG.md` file accordingly.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project. For more details, please refer to the [LICENSE.md](LICENSE) file.

Thank you for helping us improve Tiptap's documentation!