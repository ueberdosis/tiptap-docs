# tiptap-docs

## 2.0.0

### Major Changes

- 8f1ef5e: Update docs for undo-redo extension to reflect the renaming changes
- cc5f055: Updated docs to reflect package name changes for collaboration cursor
- 01958bd: Add new API for FloatingUI based BubbleMenu and FloatingMenu extensions

### Minor Changes

- 3d5120a: fix for example link for CodeBlockLowlight extension
- 4e46777: Changed the docs for the AI extension and removed the AI Advanced documentation

### Patch Changes

- 73633c2: The term 'bubble menu' was mistakenly used instead of 'floating menu' due to copy-paste from another document.
- 3a522de: language edits for index and history pages
- 439efbc: Fixed a typo on `insertContentAt` command code examples
- 2873439: Update the installation extensions required for drag handle react
- 8cad42a: Update custom LLM docs. Update the resolver return types. Specify that the LLM should respond with HTML to allow the editor to parse the response as rich-text.
- d1c4b3c: Corrected the example configuration code in the `Configure the Extension` section of the Import extension. The previous version was referencing a non-pro version of the package and initializing it with a `.Configure` call rather than a `.configure`.
- 45403ac: Added documentation for `defaultLanguage` setting in the `CodeBlock` extension.
- de0b8c5: Added new information about the useLegacyWrapping option for the comments extension.
- 13c1526: Add missing pro tag for the table of content extension in both sidebar and the Extensions overview page. Also remove a unused variable in the ExtensionGrid component.
- 15236d3: fix typo in the export extension page

## 1.0.1

### Patch Changes

- 69918b6: Fixed an issue with missing slashes in the canonical path
- 9eca07e: Include h1's in search results
- 0980f0e: Added production check to disallow robots on non-production pages

## 1.0.0

### Major Changes

- **We're happy to announce that we finally released our new Tiptap documentation!** - Welcome to the official documentation for all Tiptap products! Here, you'll find comprehensive guides, detailed examples, and in-depth documentation covering everything you need to know about working with Tiptap products.

### Minor Changes

- Added changesets for versioning & changelog generation

### Patch Changes

- Updated dedicated-cloud and self-hosted icons
- Increased max-width for h3 and smaller to look better in combination with balanced text styles
- Increase margin for section children
- Use dvh height calculations for mobile sidebars to ensure mobile UI elements won't cause the sidebar to be cutoff at the bottom of the screen
- Add link styles & hover state inside table cells
- Added options to hide all and free filters for extension grids
- Fix for the mobile navigation dropdown showing an invalid active item when the pathname is empty
- Added images to the Schema objects
- Fixed the favicon path to load with the full page domain
- Added new icon set for home page
- Fixed issues with basepath URLs in footer links
- Fixed page tracking via adding an initial mount check
- Added Hocuspocus links to footer
- Adjust code in anchor styles removing the bottom border & adding a highlight style for the code
- Added missing extension pages
- Decrease font size in mdx table cells
- Updated dedicated-cloud and self-hosted icons
- Increased max-width for h3 and smaller to look better in combination with balanced text styles
- Increase margin for section children
- Add link styles & hover state inside table cells
- Adjust code in anchor styles removing the bottom border & adding a highlight style for the code
- Decrease font size in mdx table cells
- Use dvh height calculations for mobile sidebars to ensure mobile UI elements won't cause the sidebar to be cutoff at the bottom of the screen
- Fix for the mobile navigation dropdown showing an invalid active item when the pathname is empty
- Added images to the Schema objects
- Fixed the favicon path to load with the full page domain
- Added new icon set for home page
- Fixed issues with basepath URLs in footer links
- Fixed page tracking via adding an initial mount check
- Added Hocuspocus links to footer
- Added missing extension pages
- Added changesets for versioning & changelog generation
