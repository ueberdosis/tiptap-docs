---

name: tiptap-docs-ui
description: Use when adding or changing the look of the Tiptap docs site on Fumadocs, including components, layout parts, badges, labels, cards, banners, sidebar or header parts, MDX components, and CSS. The style guide of the site, covering which Fumadocs extension point to use, color tokens, sizes, states, worked examples for new elements, and the places where the site differs from Fumadocs.
---

# Docs UI style guide

The Tiptap docs site runs on Fumadocs (`fumadocs-ui` 16.17.8, Spacious layout, Base UI, Tailwind 4). Paths below are relative to the repository root.

Fumadocs' own look is the default. The site changes it in a few places, and this file lists each change with its reason. With these rules, nobody should have to ask how a new element should look. If a case is not covered, use the Fumadocs way and name the gap in the pull request, so the rule gets added here.

Some parts below are **proposed**: built and in review, but not yet decided or in the code. Treat them as the direction. A proposed file, component or value does not exist yet: do not import it, extend it or describe it as there.

When you build a proposed part, remove its "(proposed)" marker in the same change. Touch only the markers of the parts you built. If a row or sentence covers more than your part, rewrite it so it says what is done and what is still proposed. Delete this paragraph and the one above once no "(proposed)" marker is left.

## Rules

1. **Use Fumadocs first.** If Fumadocs has a component, use it. Check `fumadocs-ui/components/*` and `fumadocs-ui/layouts/spacious/*` before you build one.
2. **Change Fumadocs in this order.** Stop at the first step that works.
   1. Props and options, for example `baseOptions()` in `src/lib/layout.shared.tsx`, `slots` on `DocsLayout`, or `tableOfContent.footer` on `DocsPage`.
   2. A `className` on the component you render.
   3. CSS on what Fumadocs exposes on purpose: `id`s and `data-*` attributes (`#nd-page`, `#nd-page-panel`, `[data-card]`), the CSS variables it sets (`--fd-toc-width`, `--fd-sidebar-width`), its `layout:` variant and its `@container` sizes (`@5xl`). Never on Fumadocs' class names or DOM structure, which change between versions.
   4. A slot built from Fumadocs' exported parts, as the sidebar does (proposed).
   5. Copying Fumadocs' file with `npx @fumadocs/cli customize`. Only with a team decision, since copied files stop getting updates.
3. **New components and layouts need approval.** Ask before you add a custom component or layout when a standard one does not fit.
4. **Colors come from tokens.** Use the `fd-*` Tailwind classes (`bg-fd-card`, `text-fd-muted-foreground`, `border-fd-border` and so on). No hex values, no Tailwind palette colors like `text-gray-500` or `bg-purple-600`, and none of the old docs' tokens like `grayAlpha-200`, which the site does not define. This also applies to classes in MDX pages. Both themes then work without extra code. The one exception is the frame around a live demo in `code-demo.tsx` and `demo-viewer/`, which matches the demo's own page color.
5. **The accent is `fd-primary`.** It is Tiptap's purple. Use it for the active state, links and small highlights only. Backgrounds, text and borders stay neutral.
6. **Use one size per job.** Take the values from the tables below. Do not invent new ones.
7. **Icons come from `lucide-react`.** Brand icons live in `src/components/brand-icons.tsx`.
8. **Build interactive parts on Base UI** (`@base-ui/react`), as Fumadocs does. Do not add another UI library.
9. **Buttons use Fumadocs' `buttonVariants`** from `fumadocs-ui/components/ui/button`.
10. **Use `cn()` from `@/lib/cn` to merge classes**, and `cva` for variants.
11. **Use logical sides** (`ps-`, `pe-`, `ms-`, `start-`) instead of `pl-`, `left-`. Fumadocs supports right-to-left layouts.
12. **Keep custom CSS in `src/app/global.css` small.** Each block gets a comment that says why it exists. Prefer Tailwind classes in the component.
13. **Write the reason down.** When you leave the Fumadocs look, add a short comment in the code and a line in this file.

## Until go-live: imported content

This section holds only while the content is imported. It is deleted together with `migration-scripts/` after go-live.

- The pages in `content/docs/` (latest) and `content/v2/` (v2) are imported. Never edit them by hand. Content changes go through the scripts in `migration-scripts/`.
- The scripts also write these files. Never edit them by hand either: the sidebars (`src/lib/navigation/latest.json`, `v2.json`), `src/lib/enterprise-content.json`, `src/lib/feature-catalog.json` and `src/lib/redirects.json`. A sidebar label belongs in the old docs' sidebar source or in `migration-scripts/sidebars.ts`. Code in `src/` only decides how a label looks.
- Old components in pages are mapped in `migration-scripts/component-mapping.ts`. Old CSS classes in pages are replaced in `migration-scripts/steps/html-classes.ts`.

## Tokens

Fumadocs' `neutral` theme. `src/app/global.css` overrides `fd-primary`, `fd-ring` and, in light, `fd-muted-foreground`.

| Token                                             | Use                                           | Our override                                          |
| ------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| `fd-background`                                   | Page                                          |                                                       |
| `fd-foreground`                                   | Main text, headings                           |                                                       |
| `fd-muted-foreground`                             | Secondary text, sidebar entries, descriptions | `#666666` in light, for 4.5:1 contrast on the sidebar |
| `fd-card`                                         | Cards                                         |                                                       |
| `fd-secondary`                                    | Labels, quiet buttons                         |                                                       |
| `fd-accent`                                       | Hover and highlighted rows                    |                                                       |
| `fd-popover`                                      | Menus, tooltips                               |                                                       |
| `fd-border`                                       | All borders and lines                         |                                                       |
| `fd-primary`                                      | Active entry, links, accents                  | `hsl(255 80% 56%)` light, `hsl(255 100% 82%)` dark    |
| `fd-ring`                                         | Focus ring                                    | Lighter primary                                       |
| `fd-warning`, `fd-error`, `fd-success`, `fd-info` | Status only                                   |                                                       |

Tints of a token use opacity: `bg-fd-primary/10`, `border-fd-primary/30`.

Text links in pages are underlined in the accent at 40%, full on hover (`#nd-page a:not([data-card])` in `global.css`). Code comments use Shiki's `colorReplacements` in `src/lib/source.ts` to reach 4.5:1, only the comment color changes.

## Sizes

| What                                                                | Value                                                                                                 |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Icon in a row, menu or button                                       | `size-4` (16px)                                                                                       |
| Small icon, for example a fold arrow                                | `size-3` to `size-3.5` (proposed)                                                                     |
| Sidebar row                                                         | `h-8`, `rounded-lg`, `gap-0.5` between rows (proposed)                                                |
| Menu item                                                           | `min-h-9`, `rounded-lg`, `px-2.5 py-2` (proposed)                                                     |
| Input-like trigger, for example the area menu                       | `h-10`, `rounded-xl`, `border` (proposed)                                                             |
| Popover                                                             | `rounded-2xl border bg-fd-popover p-1 shadow-lg` (proposed)                                           |
| Compact control or trigger, for example `version-menu.tsx`          | `h-7 rounded-md px-1.5`                                                                               |
| Tooltip, for example in `page-tags.tsx`                             | `rounded-md border bg-fd-popover px-2 py-1 text-xs shadow-md`                                         |
| Label or tag                                                        | `rounded-md border px-1.5 py-0.5 text-xs font-medium`                                                 |
| Text input, for example in `card-filter-client.tsx`                 | `h-9 rounded-lg border bg-fd-secondary/50 ps-2.5 text-sm`                                             |
| Button group, for example `Segmented` in `demo-viewer/controls.tsx` | `rounded-lg bg-fd-muted p-0.5`                                                                        |
| Divider in a control row                                            | `h-4 w-px bg-fd-border`                                                                               |
| Body text in UI                                                     | `text-sm`                                                                                             |
| Secondary line, label text                                          | `text-xs`                                                                                             |
| Section title in the sidebar                                        | `text-xs font-semibold uppercase` (proposed)                                                          |
| Text width on `full` pages                                          | `760px` for paragraphs, lists, headings and quotes. Cards, tables, code and demos take the full width |
| Space around a block in a page                                      | `my-4`, like Fumadocs' Callout, code block and Tabs (proposed)                                        |
| Space around a demo                                                 | `my-12`, `1rem` next to a code block or another demo (`code-demo.tsx`)                                |
| List item spacing                                                   | `prose-li:my-[0.25em]` on `DocsBody`                                                                  |
| Long code block, folded                                             | `max-h-[28rem]`, with a "Show all" bar below (proposed)                                               |

## States

| State                 | Classes                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| Hover                 | `hover:bg-fd-accent hover:text-fd-accent-foreground`, or `hover:bg-fd-accent/60` in dense lists (proposed) |
| Active                | `bg-fd-primary/10 text-fd-primary` (proposed)                                                              |
| Focus                 | `focus-visible:ring-2 focus-visible:ring-fd-ring`. Never remove the outline without a ring.                |
| Highlighted menu item | `data-highlighted:bg-fd-accent`, set by Base UI                                                            |
| Open                  | Base UI's `data-open`, `data-popup-open` or `data-panel-open`, not your own state                          |

Animate only opacity and scale, for 100 to 300ms, and always add `motion-reduce:transition-none` (proposed).

## Label looks

From `src/components/page-tags.tsx`. Use these three for any new label or badge.

| Look      | Classes                                                 | Use                         |
| --------- | ------------------------------------------------------- | --------------------------- |
| `neutral` | `bg-fd-secondary text-fd-secondary-foreground`          | Plans, areas, products      |
| `primary` | `border-fd-primary/30 bg-fd-primary/10 text-fd-primary` | New, beta, alpha, free, Pro |
| `warning` | `border-fd-warning/30 bg-fd-warning/10 text-fd-warning` | Deprecated, high severity   |

Incident cards also use `border-fd-error/30 bg-fd-error/10 text-fd-error` for critical severity.

A label in the sidebar is `SidebarLabel`: the label classes plus `shrink-0 py-0 font-normal`, always `neutral`.

## Components we changed

| Part                  | File                                                                                                               | What differs from Fumadocs and why                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav title             | `src/lib/layout.shared.tsx`, `src/components/ai/layout.tsx`                                                        | Tiptap logo and "Tiptap Docs", leading to the docs home of the version. A `nav.title` function puts the version menu beside the title. The title link is a flex box, so logo, text and version menu share one center line.                                                                                                                                             |
| Version menu          | `src/components/version-menu.tsx`                                                                                  | Spacious has no version menu. A Base UI `Menu` with the docs versions; v1 is an external link.                                                                                                                                                                                                                                                                         |
| Header links          | `src/lib/layout.shared.tsx`                                                                                        | Website, Discord and GitHub as icon links.                                                                                                                                                                                                                                                                                                                             |
| Header actions        | `src/components/header-actions.tsx`                                                                                | Fumadocs' actions through `slots.actions`, then a small "Sign up" button: black in light, white in dark, as on tiptap.dev.                                                                                                                                                                                                                                             |
| Page header           | `src/components/docs-page.tsx`, `header-demo.tsx`, `toc-span.tsx`, `src/lib/place-toc.ts`                          | Title, then labels and page actions in one row (actions `h-5.5`, the labels' height), then the line. Intro and `HeaderDemo` are page content below the line. `HeaderDemo` also takes the table of contents' column (`--fd-toc-width`, only at `@5xl` with the AI chat closed), and the table of contents starts below it (`tableOfContent.container`, `--toc-offset`). |
| Page labels           | `src/components/page-tags.tsx`, `src/lib/page-tag-labels.ts`                                                       | Plan and status labels from the frontmatter in three looks: `neutral`, `primary`, `warning`, with Base UI tooltips.                                                                                                                                                                                                                                                    |
| Notice bar            | `src/components/notice-banner.tsx`                                                                                 | Fumadocs' `Banner` with the moving Tiptap gradient and white text, closable through its `id` (proposed).                                                                                                                                                                                                                                                               |
| Promotion bar         | `src/components/promo-banner.tsx`                                                                                  | The notice bar's look, filled from the website's Webflow CMS. One bar at a time (proposed).                                                                                                                                                                                                                                                                            |
| Callout               | `src/components/callout.tsx`                                                                                       | The color line is the card's left edge instead of a line inside it (proposed).                                                                                                                                                                                                                                                                                         |
| Feature card          | `src/components/feature-card.tsx`                                                                                  | `my-4` when it stands on its own.                                                                                                                                                                                                                                                                                                                                      |
| Cards                 | `src/components/feature-card.tsx`, `catalog-card.tsx`, `incident-card.tsx`                                         | Fumadocs' `Card` classes and `data-card`, with images, tags, actions or a severity label that `Card` has no props for.                                                                                                                                                                                                                                                 |
| Card filter           | `src/components/card-filter.tsx`, `card-filter-client.tsx`                                                         | Fumadocs has no filter. Buttons and search above a `Cards` grid, kept in the URL query.                                                                                                                                                                                                                                                                                |
| Enterprise card       | `src/components/enterprise-card.tsx`, `src/components/docs-page.tsx`                                               | Shown below the table of contents through `tableOfContent.footer`. In the page body it hides at `@5xl`, where the table of contents shows it, unless the AI chat panel is open or the page sets `renderMode="inline"`.                                                                                                                                                 |
| Demos                 | `src/components/code-demo.tsx`, `src/components/demo-viewer/`                                                      | Live demos in a frame. The frame uses the demo's own page color (`bg-white`, dark `bg-[#110f0e]`), and the full-screen view a `bg-black/40` backdrop. These are outside the tokens on purpose.                                                                                                                                                                         |
| Long code             | `src/components/collapsible-code-block.tsx`                                                                        | Fumadocs' `CodeBlock` with `viewportProps`, folded at `28rem` with a "Show all" bar outside Fumadocs' markup (proposed).                                                                                                                                                                                                                                               |
| Steps, diagrams       | `src/lib/source.ts`, `src/components/mermaid.tsx`                                                                  | Fumadocs' `remarkSteps` and Mermaid guide, no own look (proposed).                                                                                                                                                                                                                                                                                                     |
| Full pages            | `src/components/docs-page.tsx`                                                                                     | Text stays 760px on `full` pages.                                                                                                                                                                                                                                                                                                                                      |
| Skip link             | `src/app/layout.tsx`                                                                                               | "Skip to content" to `#nd-page`, shown on focus.                                                                                                                                                                                                                                                                                                                       |
| Sidebar tabs and tree | `src/lib/navigation.tsx`, `src/components/ai/layout.tsx`                                                           | The tree comes from the old docs' sidebars (`src/lib/navigation/*.json`), not from the file tree. The tab with the longest URL scope is active.                                                                                                                                                                                                                        |
| Sidebar labels        | `SidebarLabel` in `src/components/page-tags.tsx`, `src/lib/navigation.tsx`                                         | Labels after an entry's title, for example "New". They are part of the entry's `name` and hidden in `#nd-page-panel`, where breadcrumbs reuse the name.                                                                                                                                                                                                                |
| Sidebar frame         | `src/components/sidebar/sidebar-slot.tsx`                                                                          | Spacious' `slots.sidebar`, rebuilt from exported parts, so we can add labels, the area menu, search and resizing (proposed).                                                                                                                                                                                                                                           |
| Page tree             | `src/components/sidebar/sidebar-page-tree.tsx`                                                                     | Fold arrow on the left as in a file tree, `h-8` rows, section titles in capitals, labels after titles, cut-off long titles (proposed).                                                                                                                                                                                                                                 |
| Area menu             | `src/components/sidebar/area-menu.tsx`                                                                             | Spacious' own menu with an icon and description per area. Details live in `src/lib/area-details.tsx` (proposed).                                                                                                                                                                                                                                                       |
| Sidebar search        | `src/components/sidebar/sidebar-search.tsx`                                                                        | Results stay in the sidebar while readers open one page after the other (proposed).                                                                                                                                                                                                                                                                                    |
| Lists in pages        | `src/components/docs-page.tsx`                                                                                     | Tighter list spacing: `prose-li:my-[0.25em]`.                                                                                                                                                                                                                                                                                                                          |
| AI chat               | `src/components/ai/`, `src/components/codeblock.tsx`, `src/components/tabs/ui.tsx`, `src/components/ui/button.tsx` | From the Create Fumadocs App starter, with its own sizes (`text-[13px]`, `text-[10.5px]`) and `shadow-black/5`. Do not copy them, and do not use these files in new code; use the `fumadocs-ui` exports.                                                                                                                                                               |
| Global CSS            | `src/app/global.css`                                                                                               | `scrollbar-gutter: stable`, and no added margin while a dialog locks scrolling, so the page does not shift.                                                                                                                                                                                                                                                            |

Before you change one of these, read its file. A file that copies Fumadocs' look names the Fumadocs version in its first comment (proposed). Compare it with that version's source after a Fumadocs update.

## Adding something new

1. Look for a Fumadocs component. If one fits, use it with props and `className`.
2. If not, look at a similar component in `src/components` and copy its classes and patterns. Ask before you add a new component.
3. Register MDX components in `src/components/mdx.tsx`.
4. Add a row to "Components we changed" if it changes a Fumadocs look.

## Examples

**A new card in a page**

- Start from Fumadocs' `Card` (`fumadocs-ui/components/card`), or an existing card in `src/components` such as `feature-card.tsx`. Keep `data-card`.
- `rounded-xl border bg-fd-card p-4`, title `text-sm font-medium`, text `text-sm text-fd-muted-foreground`. Hover `hover:bg-fd-accent/80`. These are Fumadocs' own `Card` classes.
- A card on its own gets `my-4`. Several cards go into Fumadocs' `Cards` grid.
- Not: a colored background, a shadow, a hex color, a new grid component.

**A new bar or notice**

- In a page, a hint is Fumadocs' `Callout` with `type`. Never a new box.
- Above the layout, use `NoticeBanner` (`src/components/notice-banner.tsx`), which is Fumadocs' `Banner`. Give it an `id` from its text, so readers can close it and a new text shows again (proposed). Until it exists, use Fumadocs' `Banner` (`fumadocs-ui/components/banner`) with an `id`.
- Not: a second bar at the same time, an own close button, an own animation.

**A demo at the top of a page**

- Use `<HeaderDemo>` once per page, at the top of the page body, right after the intro. It takes the same props as `CodeDemo`.
- Every other demo is a `CodeDemo`.

**A new label**

- Add the type to the schema in `src/lib/page-schema.ts`, and its text and look to `src/lib/page-tag-labels.ts`. Pick one of the three looks: `neutral` for plans and areas, `primary` for new and beta, `warning` for deprecated and severity.
- `rounded-md border px-1.5 py-0.5 text-xs font-medium`. A tooltip through Base UI's `Tooltip` when the label needs a reason.
- In the sidebar, render `SidebarLabel`.
- Not: a new color per label, an icon in the label.

## After a Fumadocs update

1. `pnpm types:check` and `pnpm build`. A renamed export or prop fails here, not in production.
2. Compare each file that copies Fumadocs' classes with the new version's source in `node_modules/fumadocs-ui/dist/`, and update the version in its first comment.
3. Check the parts in "Components we changed" in light, dark and on a phone.

## Reading Fumadocs

The installed source is the reference, not the website, since it matches our version.

- Spacious layout: `node_modules/fumadocs-ui/dist/layouts/spacious/`
- Its sidebar look: `node_modules/fumadocs-ui/dist/layouts/spacious/slots/sidebar.js`
- Sidebar parts: `node_modules/fumadocs-ui/dist/components/sidebar/`
- Tokens: `node_modules/fumadocs-ui/css/lib/default-colors.css`, with the `neutral.css` theme on top
- CLI, including `customize`: https://fumadocs.dev/docs/cli

## Done when

- It looks right in light and dark.
- It works in the phone drawer below 768px.
- It works with the keyboard and shows a focus ring.
- No hex colors or palette colors were added.
- `pnpm lint` and `pnpm types:check` pass.
