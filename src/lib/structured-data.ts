import type * as PageTree from 'fumadocs-core/page-tree';
import { pickTab } from './active-tab';
import { getPlainSidebarTabs } from './navigation';
import { type PageMetaFields, pageMetaDescription, pageMetaTitle } from './page-meta';
import { docsRoute, siteUrl } from './shared';
import { type VersionName, versions, versionTitle } from './versions';

const logoUrl = `${siteUrl}${docsRoute}/assets/images/tiptap-logo.png`;
const imageUrl = `${siteUrl}${docsRoute}/assets/images/example-image.jpg`;

/** Schema.org `Organization` of Tiptap, for every page. */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: siteUrl,
  sameAs: [
    'https://www.linkedin.com/company/tiptapdev/',
    'https://github.com/ueberdosis/tiptap',
    'https://discord.com/invite/WtJ49jGshW',
    'https://www.pinterest.co.uk/brand/',
    'https://twitter.com/tiptap_editor',
  ],
  image: imageUrl,
  logo: logoUrl,
  foundingDate: '2023',
  name: 'Tiptap',
  alternateName: 'Tiptap Editor',
  legalName: 'Tiptap GmbH',
  description:
    'A suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kurfürstenstraße 56',
    addressLocality: 'Berlin',
    addressCountry: 'DE',
    addressRegion: 'Berlin',
    postalCode: '10785',
  },
  vatID: 'DE358781150',
  email: 'humans@tiptap.dev',
  telephone: '+49-30-85730603',
};

/** A docs page as the structured data sees it. `url` is the app URL, for example `/docs/editor`. */
export type StructuredDataPage = PageMetaFields & { url: string };

function absoluteUrl(url: string) {
  return url.startsWith('/') ? siteUrl + url : url;
}

/**
 * Schema.org `TechArticle` of a docs page. Headline and description prefer the `meta` values.
 * Pages of an old version carry the version suffix in `headline` and the version label as
 * `version`, for example `2.x`.
 */
export function getTechArticleJsonLd(page: StructuredDataPage, version: VersionName) {
  const title = pageMetaTitle(page);
  const headline = title && versionTitle(title, version);
  const description = pageMetaDescription(page);
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    ...(headline ? { headline } : {}),
    ...(description ? { description } : {}),
    url: absoluteUrl(page.url),
    publisher: {
      '@type': 'Organization',
      name: 'Tiptap',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: logoUrl },
    },
    ...(version === 'latest'
      ? {}
      : { version: versions.find((entry) => entry.name === version)?.label }),
  };
}

function findPath(nodes: PageTree.Node[], url: string): PageTree.Node[] | undefined {
  for (const node of nodes) {
    if (node.type === 'page' && node.url === url) return [node];
    if (node.type === 'folder') {
      if (node.index?.url === url) return [node, node.index];
      const below = findPath(node.children, url);
      if (below) return [node, ...below];
    }
  }
  return undefined;
}

/** The URL of a node, or of the first page below it. External pages do not count. */
function firstPageUrl(node: PageTree.Node): string | undefined {
  if (node.type === 'page') return node.external ? undefined : node.url;
  if (node.type !== 'folder') return undefined;
  if (node.index && !node.index.external) return node.index.url;
  for (const child of node.children) {
    const url = firstPageUrl(child);
    if (url) return url;
  }
  return undefined;
}

/**
 * Schema.org `BreadcrumbList` of a docs page: the folders the visible breadcrumb shows, then the
 * page itself. A folder without its own page links to the first page below it. A page outside the
 * navigation gets only its own item.
 */
export function getBreadcrumbJsonLd(page: StructuredDataPage, version: VersionName) {
  const tab = pickTab(getPlainSidebarTabs(version), page.url);
  const path = findPath(tab.tree.children, page.url) ?? [];

  const crumbs: { name: string; url: string }[] = [];
  path.forEach((node, i) => {
    if (node.type !== 'folder' || node.index === path[i + 1]) return;
    const url = firstPageUrl(node);
    if (url && typeof node.name === 'string') crumbs.push({ name: node.name, url });
  });
  const last = path.at(-1);
  const pageName = last?.type === 'page' && typeof last.name === 'string' ? last.name : page.title;
  if (pageName) crumbs.push({ name: pageName, url: page.url });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': absoluteUrl(crumb.url), name: crumb.name },
    })),
  };
}
