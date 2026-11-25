# Migration scripts

Scripts that import the content of the current Tiptap docs into this project.

These scripts are temporary. We delete this folder after the new docs go live.

## Clone the sources

```bash
pnpm migration:clone
```

The script:

1. Deletes `migration-scripts/.sources/`.
2. Downloads the newest version of each repository below into `migration-scripts/.sources/`. It downloads only the newest commit, not the history.
3. Prints the commit ID of each download.

| Repository               | Branch | Folder             |
| ------------------------ | ------ | ------------------ |
| `ueberdosis/tiptap-docs` | `main` | `tiptap-docs-main` |
| `ueberdosis/tiptap-docs` | `v2`   | `tiptap-docs-v2`   |
| `ueberdosis/tiptap`      | `main` | `tiptap-main`      |

Example output:

```
tiptap-docs main: 6868522a3c3d83431ef74fed2bc7ddd10ec34f58
tiptap-docs v2: 7508cc07d996e96abc7c13e39452537d9e6858c5
tiptap main: 9be153b03c80428c339cc067ffda373f98b26ae4
```

Run it again any time to get the newest version. Every run starts fresh.

If a download fails, the script stops with an error.

The `.sources/` folder is not in Git.

## List what the source MDX uses

```bash
pnpm migration:inventory
```

Run `pnpm migration:clone` first.

The script:

1. Reads every `.mdx` page in `src/content/` of `tiptap-docs-main` (latest) and `tiptap-docs-v2` (v2).
2. Lists what the pages use, one list per version:
   - Components, with their props, example values and where they come from (`import`, `global`, `mdx-file` or `unknown`). `global` means `src/mdx-components.tsx` provides it.
   - HTML tags, with their props and example values.
   - Frontmatter fields.
   - Imports, grouped by kind.
   - `export` lines and `{…}` expressions in the text.
3. Writes the list to `migration-scripts/inventory.json`, with the commit ID of each clone at the top.
4. Prints the number of pages per version.

Code blocks and inline code are examples. The script does not count anything inside them.

The same sources always give the same file. Commit `inventory.json` to Git. After a new clone, run the script again. The Git diff shows what changed.

If a page cannot be read, the script stops with an error that names the page.

## Print the list

```bash
pnpm migration:inventory:print
```

Prints `inventory.json` as tables. It only reads the file.

- First a summary table with the numbers per version.
- Then one table per section with both versions. The `Versions` column shows where an item is used: `latest`, `v2` or `latest, v2`.
- A component or HTML tag that is used differently in the two versions (for example other props) gets one row per version, directly beneath each other.

Long cells are cut. Example values and all example pages are only in `inventory.json`.

To show less, add one or more sections: `components`, `html`, `frontmatter`, `imports`, `exports`, `expressions`.

```bash
pnpm migration:inventory:print components html
```

## Import the pages

```bash
pnpm migration:import
```

Run `pnpm migration:clone` and `pnpm changelogs` first. The import does not clone. `links.ts` needs the changelog index that `pnpm changelogs` writes.

The import runs eleven steps in order. It stops at the first step that fails.

1. `enterprise-content.ts` copies the enterprise card texts.
2. `copy.ts` copies the pages.
3. `redirects.ts` copies the old redirect lists and checks them against the pages.
4. `heading-ids.ts` keeps the old heading ids on the copied pages.
5. `links.ts` fixes the links on the copied pages.
6. `components.ts` replaces the old components on the copied pages.
7. `sidebars.ts` writes the sidebar navigation.
8. `v2-notice.ts` writes the v2 notice bar.
9. `feature-catalog.ts` writes the latest feature catalog.
10. `favicon.ts` copies the favicon.
11. `public-assets.ts` copies the old public files.

The same sources always give the same files. Commit them to Git. Never edit them by hand. Change the scripts and run the import again.

### Modes

| Mode        | Command                          | Component without a mapping                     |
| ----------- | -------------------------------- | ----------------------------------------------- |
| development | `pnpm migration:import`          | Allowed. The page fails to render.              |
| strict      | `pnpm migration:import --strict` | Stops with an error that names it and the page. |

A component has a mapping when it has an entry in `component-mapping.ts`. Components imported from a package, for example `lucide-react` icons, need no mapping.

### Step 1: Copy the enterprise card texts

`enterprise-content.ts`:

1. Reads `VARIANT_CONFIG` from `src/components/EnterpriseCallout.tsx` of `tiptap-docs-main`.
2. Writes `src/lib/enterprise-content.json`, one entry per variant, with the values unchanged: `title`, `description`, `showWaitlist`, and `contactUrl` and `buttonText` where set.

It stops with an error if the config is missing, or has a field it does not know or a value that is not a plain string or boolean.

`component-mapping.ts` reads the variant names from this file.

### Step 2: Copy the pages

`copy.ts`:

1. Reads every `.mdx` page in `src/content/` of `tiptap-docs-main` (latest) and `tiptap-docs-v2` (v2), and the shared fragments in `_shared/` folders (see below).
2. Copies the pages, with the same folders and file names:
   - latest to `content/docs/`
   - v2 to `content/v2/`
3. Keeps tags, props, text, frontmatter, `export` lines and `{…}` expressions unchanged. Changes only imports:

   | Import                                                                        | What the script does                                                          |
   | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
   | Into the old app, for example `@/components/...`                              | Removes the line.                                                             |
   | An `.mdx` file in `src/content/`                                              | Removes the line.                                                             |
   | An SVG icon in `@/assets/icons/` from `currentColorIcons` in `steps/cards.ts` | Imports the same file from `@/assets/images/<name>.svg?url`. Copies it there. |
   | An image in `@/assets/...`                                                    | Keeps the line. Copies the image.                                             |
   | A package of this app, for example `lucide-react`                             | Keeps the line.                                                               |
   | Anything else                                                                 | Stops with an error.                                                          |

   An `export` that uses a removed import is removed too. Strict mode does not check the components used inside it.

   In the frontmatter, it renames the `component.icon` values listed in `iconRenames` in `component-mapping.ts`. These source names are not `lucide-react` icons. The page body stays unchanged. The script stops with an error when no page uses a listed name.

   It removes the top-level frontmatter field `icon`. The old app does not use it, and its values are not `lucide-react` icons.

   It replaces `sidebars: { hideSecondary: true }` with Fumadocs' `full: true`: the page has no table of contents and uses the full width.

   It moves the frontmatter field `headerDemo` into the page body with `steps/header-demo.ts`: it removes the field and inserts `<HeaderDemo viewer view="preview" isLarge … />` as the first element of the body. `HeaderDemo` is a `CodeDemo` that also takes the table of contents' column. The fields `path`, `isPro`, `src`, `code`, `height` and `caption` become props of the same name. The `caption` HTML becomes JSX. It may only have `strong`, `em`, `code` and `a href`.

   It moves the frontmatter field `intro` into the page body with `steps/intro.ts`: it removes the field and inserts the intro as the first paragraph of the body, above the `headerDemo` demo. The HTML becomes Markdown: `<code>` becomes `` `…` ``, `<strong>` becomes `**…**` and `<a href>` becomes `[…](…)`. Other text that Markdown or MDX would read as syntax is escaped.

   A shared fragment is an MDX file in a `_shared/` folder that several pages show. The script copies it like a page. On each page, it replaces the fragment tag and import with a Fumadocs `<include>` of the same path, for example `<include>../../_shared/_regional-endpoints.mdx</include>`. The known fragments are in `fragments` in `copy.ts`.

4. Copies every imported image to `src/assets/`, with the same path.
5. Deletes `content/docs/`, `content/v2/` and `src/assets/` and writes the new files. It does this only after all pages pass the checks, so a failed run changes nothing.
6. Prints the number of pages and images per version.

It stops with an error that names the page if:

- a page cannot be read,
- a page has an unknown import (see the table),
- a file in a `_shared/` folder, or an import of one, is not a known fragment,
- a fragment tag has props or children, or is used inside `{…}` or an `export`,
- a page has a frontmatter field that is not in `src/lib/page-schema.ts`, or a value that does not match it,
- `sidebars` has another key than `hideSecondary`, or `hideSecondary` is not `true`,
- a `headerDemo` has an unknown field, a value of the wrong type, or a `caption` with another tag or attribute,
- an `intro` is not a one-line string, or has another tag or attribute, a tag inside `<code>`, or an HTML entity,
- latest and v2 have different images with the same path,
- a page imports another SVG icon from `@/assets/icons/`.

### Step 3: Copy the redirect lists

`redirects.ts`:

1. Reads the old redirect lists. It parses the files and does not run them.
   - latest: the `redirects` array in `src/server/redirects.mjs` of `tiptap-docs-main`
   - v2: the array that `redirects()` returns in `next.config.mjs` of `tiptap-docs-v2`
2. Writes `src/lib/redirects.json` as `{ "latest": [...], "v2": [...] }`. Each entry is `{ source, destination, permanent }`, unchanged and in source order.
3. Prints a note, and does not stop, for each redirect of the app (see below) where:
   - the destination is a docs path but not a page,
   - the source matches a page. The redirect hides that page, as it did in the old app.

It stops with an error if a list is missing, or an entry has another field (for example `has`) or a value that is not a plain string or boolean.

`links.ts` uses this file. It is also the input for the redirects for old URLs (see below).

#### Redirects for old URLs

`src/lib/app-redirects.mjs` turns `redirects.json` into the redirects of the app. `next.config.mjs` uses it.

- Sources get the version route: `/docs` (latest) or `/docs/v2` (v2). Old sources stay as they are, for example `/docs/resources/pricing` becomes `/docs/docs/resources/pricing`.
- A destination is a docs path when it is `/` or its first segment is a top-level folder of `content/docs/` (latest) or `content/v2/` (v2). It gets the version route, even when the page is missing. Any other destination becomes a URL on `https://tiptap.dev`, for example `https://tiptap.dev/pricing`.
- Each redirect to a docs path also gets a `.md` variant, listed before it. It sends the old path with `.md` to the new path with `.md`.
- `src/proxy.ts` then serves the Markdown of the new path.

### Step 4: Keep the old heading ids

The old app gave each heading the id `slugify(text, { strict: true, lower: true })` (slugify 1.6.6), on the heading's plain text. This app uses Fumadocs' ids (`github-slugger`). Fumadocs reads a custom id at the end of a heading: `## Heading [#some-id]`. It hides the `[#…]` in the page, the table of contents and the Markdown output.

`heading-ids.ts`:

1. Reads every `.mdx` page in `content/docs/` and `content/v2/`. Headings of files a page includes with `<include>` count as headings of that page.
2. Replaces each link inside a heading with its link text. Inline code stays. Prints each one with its page and URL.
3. Works out each heading's old id and its Fumadocs id. Where they differ, it appends ` [#old-id]` to the heading. Where they match, the heading stays unchanged.
4. Adds `[#old-id]` only to the first heading with that old id on a page. Old links always landed there. Later copies keep the id Fumadocs gives them.
5. Changes only these parts. The rest of each file stays byte for byte the same.
6. Writes the changed files only after all pages pass.
7. Prints the number of added ids and headings per version.

The old id re-creates slugify's rules: `&` becomes `and`, `|` becomes `or`, `<` and `>` become `less` and `greater`, `$` becomes `dollar`, `%` becomes `percent`. Other symbols are dropped, runs of dashes become one, and edge dashes are trimmed. Non-ASCII characters need a rule in `slugifyCharMap`.

It stops with an error that names the page on:

- a heading part other than text, inline code or a link,
- a non-ASCII character without a rule,
- a heading that already ends with `[#…]`,
- an included heading that two pages need with different ids,
- two headings with the same id on a page.

### Step 5: Fix the links

The old app added `/docs` to every link. This app has no such prefix: latest is at `/docs/…`, v2 at `/docs/v2/…`.

`links.ts`:

1. Reads every `.mdx` page in `content/docs/` and `content/v2/`.
2. Finds every link: Markdown links, reference definitions (`[x]: /path`), the props `href`, `documentationUrl` and `secondaryUrl` on any tag or component, also inside `{…}`, `href` properties of objects in `{…}` prop values (for example `actions={[{ href: "/…" }]}`), and `url` in a `moreLink={{ … }}` prop. Code blocks and inline code are not links.
3. Rewrites each root link (`/…`) on a page of version V:
   1. It follows V's old redirects, as Next.js does.
   2. If the path is a page of V, it writes `/docs/<path>` (latest) or `/docs/v2/<path>` (v2).
   3. Else, if the path starts with `/docs/` and the rest is a page of V, it uses the rest.
   4. On latest pages only: the package changelog pages count as pages at `resources/changelog/<slug>`. The slugs come from `.changelogs/index.json`, written by `pnpm changelogs`. The script stops with an error if that file is missing.
   5. On latest pages only: if the path is a file that `public-assets.ts` copies (step 11), it writes `/docs/<path>`. A `/docs/` prefix is handled as for pages. A link to a file with an anchor is unresolved.
   6. If at least one redirect matched and the final path is outside the docs (its first segment is not a top-level content folder, the test of `src/lib/app-redirects.mjs`), it writes the URL on `https://tiptap.dev`, for example `/docs/resources/pricing` → `https://tiptap.dev/pricing`.
4. Checks the anchor of each root link and each `#anchor` link against the headings of the target page, including the headings of files it includes with `<include>`. Heading ids follow this app's rule (`github-slugger`), or the custom id (`[#id]`) from step 4. An anchor in the old id format (`slugify`), or the id a heading would have without its custom id, gets the heading's id. An `id` prop on a tag counts as found.
5. If the page is found but the anchor is not, it writes the page URL and keeps the anchor as in the source. Anchors on changelog pages are not checked and are handled the same way. Any other link it cannot resolve stays as it is.
6. Changes only the link target. The rest of each file stays byte for byte the same.
7. Writes the changed pages only after all pages pass.
8. Prints the numbers per version and every link with a page or anchor it cannot find, with its page and reason.

Relative (`./`, `../`) and external links stay as they are.

It stops with an error that names the page if a link prop is not one string, or if it cannot find a link in the source text.

### Step 6: Replace the old components

`components.ts`:

1. Reads every `.mdx` page in `content/docs/` and `content/v2/`.
2. Rewrites each component that has an entry in `component-mapping.ts`. It changes only these tags. The rest of each file stays byte for byte the same.
3. Writes the changed pages. It does this only after all pages pass, so a failed run changes nothing.
4. Prints the number of rewritten tags per component and version.

It needs the fresh output of steps 3 to 5, so it has no command of its own.

### The mapping file

`component-mapping.ts` has one entry per old component, for example `Callout` or `CardGrid.Item`.

| Field      | Meaning                                                            |
| ---------- | ------------------------------------------------------------------ |
| `type`     | `same`, `other name`, `new` or `remove`.                           |
| `to`       | The new component name.                                            |
| `props`    | A rule for every allowed old prop.                                 |
| `defaults` | Props to add with this value when no old prop sets them. Optional. |
| `special`  | Extra edits from a file in `steps/`. Optional.                     |
| `shape`    | Name of the shape step that rewrites it. Optional.                 |

| Prop rule        | What the script does                                                        |
| ---------------- | --------------------------------------------------------------------------- |
| `'keep'`         | Keeps the prop as it is.                                                    |
| `'remove'`       | Removes the prop.                                                           |
| `{ to }`         | Renames the prop to `to`.                                                   |
| `{ to, values }` | Renames the prop to `to` and maps its value. The value must be in `values`. |

A mapped component inside the JSX of a prop, for example `captionActions={<>…<Link>…</Link></>}`, is renamed too. There it may only have props with the rule `'keep'`, and its mapping may have no `defaults` or `special`.

The script stops with an error that names the page if a mapped component:

- has a prop without a rule,
- has a value that is not in `values`,
- has two props that set the same new prop,
- has a spread prop, for example `{...props}`,
- is inside a `{…}` expression or an `export`,
- is inside a prop and needs more than a rename,
- has the mapping type `remove`. This type is not supported yet.
- has a `shape`. Such a component is allowed only inside that shape.

Groups that need more than these rules get their own file in `migration-scripts/steps/`. Its function goes in `special`. A shape made of several tags, for example a `div` grid of `Link` cards, goes in `shapeSteps` instead. Shape steps see every JSX element first. An element they rewrite is replaced as a whole and not mapped further, unless the step sets `keepsChildren`. Then it rewrites only the element's own tags, and the children are mapped as usual.

| File                           | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `steps/html-classes.ts`        | `gridWrapperEdits`: removes the tags of a `<div className="grid gap-20">` and moves its children to the div's own indent. `components.ts` runs it on each page before all other steps. Stops on a `div` with `grid` and `gap-20` classes of any other shape, or with another grid `div` inside. `oldClassEdits`: replaces the old classes `text-grayAlpha-600`, `hover:text-grayAlpha-800` and `text-grayAlpha-300` in `className` values of every tag, also inside props, `{…}` and exports, with Fumadocs classes. Stops on any other `grayAlpha` class, and on a `grayAlpha` class it cannot read. MDX comments are not read. `components.ts` runs it on every tag that no shape step replaces.                                                                                                                                                                                                                                          |
| `steps/requirements.ts`        | Adds `## Requirements` before `<Requirements>`. Stops if the tag is not at the start of a top-level line.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `steps/link-cards.ts`          | Shape step. Rewrites a hand-made link card grid to `<Cards>` and `<Card title href>`. Drops "More →". Stops on a card grid or a card `Link` of any other shape.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `steps/cards.ts`               | Shape step. Rewrites the old card grids (`CardGrid`, `FilterGrid`, `Grid`, a `div` grid of `ProductCard`s) to `<Cards>` with Fumadocs `Card`, `FeatureCard` and `CardFilter`. Copies prop sources, titles and texts unchanged. An icon `img` gets the whole image import as `src`. An icon from `currentColorIcons` becomes an `img` with `dark:invert`. Stops on an old card component outside these grids, and on any other shape.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `steps/full-screen-buttons.ts` | Shape step. Rewrites a `Button` with one full-screen `Link` to one `a` with the classes of `buttonVariants({ variant })` from `fumadocs-ui`, plus `gap-2 not-prose`. Leaves a `Button` of any other shape as it is.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `steps/content-cards.ts`       | Shape step. Rewrites a `div` grid of `ContentCard`s to `<Cards>` with `<Card href icon title>` and the description as text. Stops on a `ContentCard` outside such a grid, and on any other shape.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `steps/sections-and-boxes.ts`  | Two shape steps. `sections` rewrites a `Section` to a `##` heading, its `description` as a paragraph and its `moreLink` as a Markdown link, and keeps its children. `boxes` rewrites a `CtaBox.Wrapper` or `ImageCard.Card` (with `imagePosition="side"`) to `FeatureCard`, with the `Button` links inside as `actions`. Copies titles, texts, `href`s and the image expression unchanged. Stops on a part of these outside them, on a `Button` no earlier shape step rewrites, and on any other shape.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `steps/use-cases.ts`           | Shape step. Rewrites `<UseCasesGrid variant>` (latest only) to `<Cards>` with one `<Card href icon title>` per use case and its description as text. Reads the lists `CLIENT_USE_CASES` and `GENERATION_USE_CASES` from `src/components/UseCasesGrid.tsx` of `tiptap-docs-main` with plain string parsing. Tags `AI Agents` and `Workflows` get the headings `## AI agents` and `## Custom workflows`; `Basic AI Generation` gets none. Adds the icon import from `lucide-react`. Fixes the links with `resolvePageLink` from `links.ts`. A link to a found page with an unknown anchor gets the page URL with the anchor kept and is printed; any other link it cannot resolve is printed and kept. Stops on any other shape of the source file: another list, field, value type, tag, section title or variant, a missing or extra item, or an icon that is not imported from `lucide-react` or is not a `lucide-react` icon in this app. |

### Step 7: Write the sidebar navigation

`sidebars.ts`:

1. Runs the source sidebar files with `run-source.ts` (see below). The source code runs as it is, so the composed latest sidebar and its plan labels are the same as in the old app.
2. Writes one file per version, `src/lib/navigation/latest.json` and `src/lib/navigation/v2.json`, formatted with Biome. Each file has one tab per source sidebar:

   | Version | Sidebar files                                                    | Tab title                    |
   | ------- | ---------------------------------------------------------------- | ---------------------------- |
   | latest  | `src/content/sidebar.ts`, `src/content/ui-components/sidebar.ts` | Documentation, UI Components |
   | v2      | every `src/content/**/sidebar.ts`, sorted by path                | the sidebar `title`          |

   Each tab has the `rootHref` as `url` and a `scope`: the URL of the sidebar's folder. A page shows the tab with the longest scope its URL starts with, like the nearest `sidebar.ts` in the old app.
3. Keeps titles, order, groups and nesting. Turns each `href` into an app URL with `resolvePageLink` from `links.ts`, so redirects and anchors resolve as in step 4. An `http(s)` link is external.
4. Writes the labels the old sidebar shows:
   - latest: at most one, the first of `Deprecated`, `Paid` (any paid plan) and `Open source`. `hidePlan` hides `Paid`. `newSince` stays a date. The app shows "New" when the render date is less than 90 days after it.
   - v2: `Beta` for `beta`, then every tag as it is.
5. Prints a note for each source setting it drops: `isActive: false`, `defaultOpen: true` on a link, and the links in `knownMissing`.

It stops with an error that names the sidebar and the entry on:

- an unknown field or a value of the wrong type,
- `disabled` or `isActive: true`,
- an entry with neither `href` nor children,
- a link that is not an imported page, except the approved entries in `knownMissing`. These are left out of the menu.

`src/lib/navigation.tsx` turns each tab into a Fumadocs page tree. A collapsible group becomes a folder, another group a separator title, `divider` a separator. `src/components/ai/layout.tsx` picks the tab for the current URL and passes its tree to the Fumadocs layout.

### Step 8: Write the v2 notice bar

`v2-notice.ts`:

1. Runs `src/utils/constants.ts` of `tiptap-docs-v2` with `run-source.ts` and reads `CTA_BAR`.
2. Writes `src/lib/v2-notice.json`, formatted with Biome: `{ "text", "url" }`, or `null` when `CTA_BAR` is `null`. The text stays as it is. The url must be `https://tiptap.dev/docs` or a page below it. It becomes an app URL with `resolvePageLink` from `links.ts`, for example `https://tiptap.dev/docs/resources/whats-new` → `/docs/resources/whats-new`.

It stops with an error on:

- a value that is not an object or `null`,
- a field other than `text` and `url`, or a value that is not a non-empty string,
- a url outside `https://tiptap.dev/docs`,
- a url that is not an imported latest page.

The v2 layout `src/app/docs/v2/layout.tsx` shows the text as a link in the Fumadocs `Banner` on every v2 page. With `null` it shows no banner.

### Step 9: Write the feature catalog

`feature-catalog.ts`:

1. Runs these files of `tiptap-docs-main` with `run-source.ts`: `getCatalog()` in `src/server/getCatalog.ts` (the entries), `CATALOG_GROUPS` in `src/content/catalog.ts` (the groups) and `PLAN_LABELS` in `src/content/plans.ts` (the plan names).
2. Writes `src/lib/feature-catalog.json`, formatted with Biome: the plans that entries use (`value`, `label`), the groups (`id`, `title`) and the entries (`name`, `description`, `icon`, `group`, `plan`, `tags`, `url`). `tags` is the plan label, then the status if there is one. `url` becomes an app URL with `resolvePageLink`, for example `/editor/extensions/marks/bold` → `/docs/editor/extensions/marks/bold`. The order stays as in the source.

It stops with an error on:

- a field the script does not know, or a missing or empty value,
- an entry with an unknown group or plan,
- a group without entries,
- an entry url that is not an imported latest page.

`src/lib/remark-catalogs.ts` reads the file at build time. It replaces `<FeatureCatalog />` with all entries (search, one filter button per plan, one `h2` per group) and `<CatalogGroup id="…" />` with the cards of one group. An unknown `id`, an unknown icon or a use outside the latest docs stops the build.

### Step 10: Copy the favicon

`favicon.ts` copies `public/favicon.png` of `tiptap-docs-main` to `src/app/icon.png`, unchanged. Next.js serves it as the site icon. It stops with an error when the file is missing or is not a PNG.

### Step 11: Copy the old public files

`public-assets.ts`:

1. Deletes `public/docs/assets/`.
2. Copies every file under `public/assets/` of `tiptap-docs-main` to `public/docs/assets/`, with the same paths and unchanged. The app serves them at the old URLs `/docs/assets/…`. The structured data (JSON-LD) links to the logo there.

It stops with an error that names the file when its type is not `png`, `jpg`, `svg` or `json`.

### Running source TypeScript

`run-source.ts` runs TypeScript files of a clone as they are and returns one named export of each. With a list of argument lists, the export must be a function: it is called once per list, and the results are returned.

1. Compiles the files and what they import with the installed `tsc` (`noCheck`) into `.sources/<name>/`.
2. Runs the result with Node through `source-loader.ts` and returns the export as JSON data. It stops when a file does not have the export.
   - `source-loader.ts` resolves `@/…` imports and imports without an extension. The working directory is the clone, because the source reads its pages from there.
   - The sidebar source imports the package `front-matter`. `sidebar-front-matter.ts` stands in for it and parses with `yaml`.

## Requirements

- Node.js 22.18 or newer. These versions run TypeScript files directly.
- `git`
- Internet access to GitHub
