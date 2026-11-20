import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { SidebarLabel } from '@/components/page-tags';
import latest from './navigation/latest.json';
import v2 from './navigation/v2.json';

/** One sidebar entry. A group only appears at the top level of a tab. */
export type NavigationEntry = {
  type: 'group' | 'link';
  title: string;
  /** App URL. Missing on an entry that only folds open, and on a group. */
  url?: string;
  external?: boolean;
  labels?: string[];
  /** The day the page went live (YYYY-MM-DD). */
  newSince?: string;
  /** Group only: the title folds the group open and closed. */
  collapsible?: boolean;
  /** Group only: a collapsible group that starts open. */
  defaultOpen?: boolean;
  /** Group only: a line above the group. */
  divider?: boolean;
  children?: NavigationEntry[];
};

/** One sidebar of the old docs. */
export type NavigationTab = {
  title: string;
  /** The source sidebar file. */
  source: string;
  /** Where the tab switcher links to. */
  url: string;
  /** URL prefix of the pages that show this tab. The longest matching scope wins. */
  scope: string;
  entries: NavigationEntry[];
};

/** The generated navigation file of one version. */
export type Navigation = { tabs: NavigationTab[] };

/** A tab with its page tree, ready for the docs layout. */
export type SidebarTab = { title: string; url: string; scope: string; tree: PageTree.Root };

const newForDays = 90;

/** Whether an entry that went live on `since` still counts as new at render time. */
function isNew(since: string | undefined): boolean {
  if (!since) return false;
  const start = Date.parse(since);
  return !Number.isNaN(start) && Date.now() - start < newForDays * 24 * 60 * 60 * 1000;
}

function entryLabel(entry: NavigationEntry): ReactNode {
  const labels = [...(entry.labels ?? [])];
  if (labels.length === 0 && isNew(entry.newSince)) labels.push('New');
  if (labels.length === 0) return entry.title;
  return (
    <>
      <span className="flex-1">{entry.title}</span>
      {labels.map((text) => (
        <SidebarLabel key={text}>{text}</SidebarLabel>
      ))}
    </>
  );
}

/** The name a tree node shows for an entry. */
type EntryName = (entry: NavigationEntry) => ReactNode;

function toNode(entry: NavigationEntry, entryName: EntryName): PageTree.Node {
  const name = entryName(entry);
  const page: PageTree.Item | undefined = entry.url
    ? { type: 'page', name, url: entry.url, external: entry.external }
    : undefined;
  if (!entry.children?.length) return page as PageTree.Item;
  return {
    type: 'folder',
    name,
    index: page,
    children: entry.children.map((child) => toNode(child, entryName)),
  };
}

function toNodes(entries: NavigationEntry[], entryName: EntryName): PageTree.Node[] {
  return entries.flatMap((entry): PageTree.Node[] => {
    if (entry.type === 'link') return [toNode(entry, entryName)];
    const separator: PageTree.Node[] = entry.divider ? [{ type: 'separator' }] : [];
    if (!entry.collapsible) {
      return [
        ...separator,
        { type: 'separator', name: entryName(entry) },
        ...(entry.children ?? []).map((child) => toNode(child, entryName)),
      ];
    }
    return [
      ...separator,
      {
        type: 'folder',
        name: entryName(entry),
        collapsible: true,
        defaultOpen: entry.defaultOpen,
        children: (entry.children ?? []).map((child) => toNode(child, entryName)),
      },
    ];
  });
}

const navigations: Record<'latest' | 'v2', Navigation> = { latest, v2 } as Record<
  'latest' | 'v2',
  Navigation
>;

const changelogUrl = '/docs/resources/changelog';
const changelogIndexPath = join(process.cwd(), '.changelogs', 'index.json');

/** Sidebar entries of the package changelogs, read from `.changelogs/index.json`. */
function changelogEntries(): NavigationEntry[] {
  if (!existsSync(changelogIndexPath)) {
    throw new Error(
      'Missing .changelogs/index.json. Run `pnpm changelogs` (or `SKIP_CHANGELOGS=1 pnpm changelogs`).',
    );
  }
  const index = JSON.parse(readFileSync(changelogIndexPath, 'utf8')) as {
    slug: string;
    packageName: string;
  }[];
  return index.map(({ slug, packageName }) => ({
    type: 'link',
    title: packageName,
    url: `${changelogUrl}/${slug}`,
  }));
}

/** Copies `entries` and sets the children of the entry at `url`. */
function withChildren(
  entries: NavigationEntry[],
  url: string,
  children: NavigationEntry[],
): NavigationEntry[] {
  return entries.map((entry) => {
    if (entry.url === url) return { ...entry, children };
    if (!entry.children) return entry;
    return { ...entry, children: withChildren(entry.children, url, children) };
  });
}

function versionTabs(version: 'latest' | 'v2'): NavigationTab[] {
  const tabs = navigations[version].tabs;
  if (version !== 'latest') return tabs;
  const children = changelogEntries();
  return tabs.map((tab) => ({
    ...tab,
    entries: withChildren(tab.entries, changelogUrl, children),
  }));
}

function buildTabs(version: 'latest' | 'v2', entryName: EntryName): SidebarTab[] {
  return versionTabs(version).map((tab, index) => ({
    title: tab.title,
    url: tab.url,
    scope: tab.scope,
    tree: {
      $id: `${version}-${index}`,
      name: tab.title,
      children: toNodes(tab.entries, entryName),
    },
  }));
}

/** The sidebar tabs of a version, each with its page tree. Names show the entry labels. */
export function getSidebarTabs(version: 'latest' | 'v2'): SidebarTab[] {
  return buildTabs(version, entryLabel);
}

/** The sidebar tabs of a version, each with its page tree. Every name is the plain entry title. */
export function getPlainSidebarTabs(version: 'latest' | 'v2'): SidebarTab[] {
  return buildTabs(version, (entry) => entry.title);
}
