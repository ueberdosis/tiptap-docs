import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { metaSchema } from 'fumadocs-core/source/schema';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { defineCollections, defineDocs } from 'fumadocs-mdx/macro';
import { docsPageSchema } from './page-schema';
import { type RemarkCatalogsOptions, remarkCatalogs } from './remark-catalogs';
import { remarkEnterpriseCards } from './remark-enterprise-cards';
import { filterMarkdownElement, remarkMarkdownExpressions } from './remark-markdown-output';
import { docsRoute, docsV2Route } from './shared';

const mdxOptions = (catalogs: RemarkCatalogsOptions) =>
  applyMdxPreset({
    // `remarkCatalogs` runs first, so its headings get IDs and its output is in the processed text.
    remarkPlugins: (plugins) => [
      [remarkCatalogs, catalogs],
      ...plugins,
      remarkEnterpriseCards,
      remarkMarkdownExpressions,
    ],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      // Shiki adds its own aliases to this object, so every highlighter needs a fresh copy.
      get langAlias() {
        return { curl: 'bash', env: 'dotenv' };
      },
      // Alias targets are not loaded on demand.
      langs: ['bash', 'dotenv'],
      fallbackLanguage: 'text',
      // Both GitHub themes color comments #6a737d, below WCAG AA's 4.5:1 on our code blocks.
      // These reach 5.0:1 on light (#f1f1f1) and 4.7:1 on dark (#191919). Other token colors stay.
      colorReplacements: {
        'github-light': { '#6a737d': '#5f6873' },
        'github-dark': { '#6a737d': '#7d8590' },
      },
    },
  });

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    files: ['**/*.mdx', '!**/_shared/**'],
    schema: docsPageSchema,
    mdxOptions: mdxOptions({ dir: 'content/docs', baseUrl: docsRoute }),
    postprocess: {
      includeProcessedMarkdown: {
        output: 'function',
        headingIds: false,
        filterElement: filterMarkdownElement,
      },
      valueToExport: ['enterpriseCards'],
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/** Package changelogs written by `pnpm changelogs`, plain Markdown. */
const changelogs = defineCollections({
  type: 'doc',
  dir: '.changelogs',
  files: ['*.md'],
  schema: docsPageSchema,
  mdxOptions: mdxOptions({ dir: 'content/docs', baseUrl: docsRoute }),
  postprocess: {
    includeProcessedMarkdown: {
      output: 'function',
      headingIds: false,
      filterElement: filterMarkdownElement,
    },
    valueToExport: ['enterpriseCards'],
  },
});

const changelogFiles = changelogs
  .toFumadocsSource({ baseDir: 'resources/changelog' })
  .files.filter((file) => file.type === 'page');
const changelogPaths = new Set(changelogFiles.map((file) => file.path));

const docsSource = docs.toFumadocsSource();
const latestFiles: typeof docsSource = { files: [...docsSource.files, ...changelogFiles] };

const v2Docs = defineDocs({
  dir: 'content/v2',
  docs: {
    files: ['**/*.mdx', '!**/_shared/**'],
    schema: docsPageSchema,
    mdxOptions: mdxOptions({ dir: 'content/v2', baseUrl: docsV2Route }),
    postprocess: {
      includeProcessedMarkdown: {
        output: 'function',
        headingIds: false,
        filterElement: filterMarkdownElement,
      },
      valueToExport: ['enterpriseCards'],
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: latestFiles,
  plugins: [lucideIconsPlugin()],
});

export const v2Source = loader({
  baseUrl: docsV2Route,
  source: v2Docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type DocsSource = typeof source;

/** Whether a latest page is a package changelog from `pnpm changelogs`. */
export function isPackageChangelog(page: { path: string }): boolean {
  return changelogPaths.has(page.path);
}

/** Page paths (slugs joined by `/`) that both versions have. The home page is left out. */
export function getSharedPagePaths(): string[] {
  const v2Paths = new Set(v2Source.getPages().map((page) => page.slugs.join('/')));
  return source
    .getPages()
    .map((page) => page.slugs.join('/'))
    .filter((path) => path !== '' && v2Paths.has(path))
    .sort();
}
