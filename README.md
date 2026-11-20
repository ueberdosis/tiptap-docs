# tiptap-docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Package changelogs

`pnpm changelogs` fetches `packages/*/CHANGELOG.md` from `ueberdosis/tiptap` and `ueberdosis/tiptap-pro` (branch `main`) and writes one page per package to `.changelogs/`. The pages appear at `/docs/resources/changelog/<package>`.

- `pnpm build` runs it first. `pnpm dev` does not, so run `pnpm changelogs` once before `pnpm dev`.
- `GITHUB_TOKEN` must be set, in the environment or in `.env.local`. It needs read access to `ueberdosis/tiptap-pro`. Without it, the step fails.
- `SKIP_CHANGELOGS=1` skips the fetch. The site then has no package changelog pages.
- `.changelogs/` is generated and gitignored. Do not edit it.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

Collections are defined with the [Macro API](https://fumadocs.dev/docs/mdx/macro) in `lib/source.ts`.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
