import { llms } from 'fumadocs-core/source';
import { getMarkdownComponents } from '@/lib/markdown-components';
import { absoluteMarkdownLinks } from '@/lib/markdown-links';
import { pageHeaderTags } from '@/lib/page-header-tags';
import { severityLabel, tagLabel } from '@/lib/page-tag-labels';
import {
  docsRoute,
  docsV2Route,
  getPageMarkdownUrl,
  isProductionSite,
  previewRobots,
  siteUrl,
} from '@/lib/shared';
import { type DocsSource, getSharedPagePaths, source, v2Source } from '@/lib/source';
import { getV2PageNotice } from '@/lib/v2-notice';
import type { VersionName } from '@/lib/versions';

type Page = ReturnType<DocsSource['getPages']>[number];

/** A docs version with its pages, for the Markdown output. */
export type MarkdownVersion = {
  name: VersionName;
  source: DocsSource;
  /** Content folder, for error messages. */
  contentDir: string;
};

export const markdownVersions: Record<VersionName, MarkdownVersion> = {
  latest: {
    name: 'latest',
    source,
    contentDir: 'content/docs',
  },
  v2: {
    name: 'v2',
    source: v2Source,
    contentDir: 'content/v2',
  },
};

/** Fumadocs `llms()` of a version. Pages render with `getPageMarkdown`, as on their `.md` URL. */
const versionLlms = (version: MarkdownVersion) =>
  llms(version.source, { renderPage: (page) => getPageMarkdown(page, version) });

/** Fumadocs `llms()` of the latest pages. */
export const docsLlms = versionLlms(markdownVersions.latest);
/** Fumadocs `llms()` of the v2 pages. */
export const v2Llms = versionLlms(markdownVersions.v2);

/** Removes HTML tags and collapses whitespace. */
function stripHtml(value: string) {
  let previous: string;
  let output = value;
  do {
    previous = output;
    output = output.replace(/<[^<>]*>/g, '');
  } while (output !== previous);
  return output.replace(/\s+/g, ' ').trim();
}

const pageTitle = (page: Page) => page.data.title ?? page.data.meta?.title;

const pageDescription = (page: Page) => {
  const description = page.data.description ?? page.data.meta?.description;
  return description ? stripHtml(description) : undefined;
};

/** Absolute URL of the HTML page. */
export const getPageUrl = (page: Page) => siteUrl + page.url;

let sharedPaths: ReadonlySet<string> | undefined;

/** The v2 notice as a Markdown quote, linking to the `.md` URL. `undefined` when there is none. */
function v2NoticeQuote(page: Page) {
  sharedPaths ??= new Set(getSharedPagePaths());
  const notice = getV2PageNotice(page.slugs.join('/'), sharedPaths);
  if (!notice) return undefined;
  const url = siteUrl + notice.url.replace(/(?=[?#]|$)/, '.md');
  return `> ${notice.text ? `${notice.text} ` : ''}[${notice.linkText}](${url})`;
}

/** Text of the page header labels, as on the HTML page. Image tags are left out. */
function pageTagTexts(page: Page, version: VersionName) {
  const labels = [
    severityLabel(page.data.incident?.severity),
    ...pageHeaderTags(page.data.tags, page.slugs, version).map((tag) =>
      tag.type === 'image' ? null : tagLabel(tag, version, page.slugs.includes('templates')),
    ),
  ];
  return labels.flatMap((label) => (label ? [label.text] : []));
}

/**
 * The page as Markdown: frontmatter (title, description, canonical URL on latest), the v2 notice,
 * the title, the description, the page labels and the converted body, with absolute `.md` links
 * to docs pages. `entry` replaces the frontmatter with a `Source: <page URL>` line under the
 * title, for pages joined into one file, and puts the v2 notice below it. Throws an error that
 * names the page when the body has a component without a Markdown form.
 */
export async function getPageMarkdown(page: Page, version: MarkdownVersion, entry = false) {
  let body: string;
  try {
    const text = await page.data.getText('processed', {
      components: getMarkdownComponents(version.name),
    });
    body = absoluteMarkdownLinks(text.trim());
  } catch (error) {
    throw new Error(`${version.contentDir}/${page.path}: ${(error as Error).message}`, {
      cause: error,
    });
  }

  const title = pageTitle(page);
  const description = pageDescription(page);
  const tags = pageTagTexts(page, version.name);
  const isLatest = version.name === 'latest';
  const notice = isLatest ? undefined : v2NoticeQuote(page);
  const frontmatter = [
    title && `title: ${JSON.stringify(title)}`,
    description && `description: ${JSON.stringify(description)}`,
    isLatest && `canonical_url: ${JSON.stringify(getPageUrl(page))}`,
  ].filter(Boolean);
  const parts = [
    !entry && `---\n${frontmatter.join('\n')}\n---`,
    !entry && notice,
    title && `# ${title}`,
    entry && `Source: ${getPageUrl(page)}`,
    entry && notice,
    description,
    tags.length > 0 && `Tags: ${tags.join(', ')}`,
    body,
  ].filter(Boolean);
  return `${parts.join('\n\n')}\n`;
}

/** Latest pages, sorted by URL. */
const sortedPages = () =>
  markdownVersions.latest.source.getPages().sort((a, b) => a.url.localeCompare(b.url, 'en'));

/** `editor-extensions` → `Editor Extensions`. */
const sectionTitle = (section: string) =>
  section
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** Top-level content folder of a page, `undefined` for a page at the root. */
const pageProduct = (page: Page) => {
  const [folder, ...rest] = page.path.split('/');
  return rest.length > 0 ? folder : undefined;
};

/** True for a page with a path segment that starts with `changelog`. */
const isChangelog = (page: Page) => page.slugs.some((slug) => slug.startsWith('changelog'));

/** Products of latest: its top-level content folders, sorted. */
export const getLlmsProducts = () =>
  [...new Set(sortedPages().flatMap((page) => pageProduct(page) ?? []))].sort((a, b) =>
    a.localeCompare(b, 'en'),
  );

/** Absolute URL of a product's `llms-full.txt`. */
const llmsFullUrl = (product: string) => `${siteUrl}${docsRoute}/${product}/llms-full.txt`;

/**
 * `/docs/llms.txt`: intro, links to the full text per product, every latest page grouped by its
 * top-level folder, and a short note on the 2.x docs.
 */
export function getLlmsIndex() {
  const sections = new Map<string, Page[]>();
  for (const page of sortedPages()) {
    const section = page.slugs[0] ?? 'index';
    sections.set(section, [...(sections.get(section) ?? []), page]);
  }

  const lines = [
    '# Tiptap Documentation',
    '',
    '> Tiptap is the headless and extensible rich-text editor framework tailored to modern web and app development needs.',
    '',
    'Every page is available as Markdown: append `.md` to any documentation URL, or send an `Accept: text/markdown` header.',
    '',
    'For a product overview and curated entry points, see https://tiptap.dev/llms.txt',
    '',
    '## Full text per product',
    '',
    'The Markdown of all pages of one product in one file. Changelogs are left out.',
    '',
    ...getLlmsProducts().map((product) => `- [${sectionTitle(product)}](${llmsFullUrl(product)})`),
    '',
  ];
  for (const [section, pages] of [...sections].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    lines.push(`## ${sectionTitle(section)}`, '');
    for (const page of pages) {
      const description = pageDescription(page);
      const url = siteUrl + getPageMarkdownUrl(page).url;
      lines.push(
        `- [${pageTitle(page) ?? page.url}](${url})${description ? `: ${description}` : ''}`,
      );
    }
    lines.push('');
  }
  lines.push(
    '## Legacy',
    '',
    `Tiptap 2.x docs are at ${siteUrl}${docsV2Route}. Each page is available as Markdown by adding \`.md\` to its URL.`,
  );
  return `${lines.join('\n').trim()}\n`;
}

/** `llms-full.txt` of a latest product: the Markdown of its pages without changelogs, sorted by URL. */
export async function getLlmsFull(product: string) {
  const pages = await Promise.all(
    sortedPages()
      .filter((page) => pageProduct(page) === product && !isChangelog(page))
      .map((page) => getPageMarkdown(page, markdownVersions.latest, true)),
  );
  return pages.join('\n');
}

/** Headers of `llms.txt` and `llms-full.txt`. */
export const llmsTextHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
};

/**
 * Markdown page response, with a `Link: rel=canonical` header when `canonicalUrl` is set.
 * `Accept` requests get `Cache-Control: private, no-store` in the proxy.
 */
export function markdownResponse(markdown: string, canonicalUrl?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'text/markdown; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Accept',
    'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    'X-Robots-Tag': isProductionSite ? 'noindex' : previewRobots,
  };
  if (canonicalUrl) headers.Link = `<${canonicalUrl}>; rel="canonical"`;
  return new Response(markdown, { headers });
}
