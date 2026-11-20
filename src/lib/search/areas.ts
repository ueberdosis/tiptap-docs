import type { Navigation, NavigationEntry } from '@/lib/navigation';

/** A sidebar area: its overview page and every page that belongs to it. */
export type SearchArea = { name: string; overview: string; pages: ReadonlySet<string> };

/** Lowercase, trimmed, with single spaces. */
export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pageUrls(entries: NavigationEntry[]): string[] {
  return entries.flatMap((entry) => [
    ...(entry.url && !entry.external ? [entry.url] : []),
    ...pageUrls(entry.children ?? []),
  ]);
}

function overviewUrl(entry: NavigationEntry): string | undefined {
  if (!entry.children?.length) return undefined;
  if (entry.url && !entry.external) return entry.url;
  return entry.children.find((child) => child.title === 'Overview' && child.url && !child.external)
    ?.url;
}

/**
 * The areas of a version's sidebar, by normalized name. Does no I/O.
 *
 * - A tab, group or folder with an overview page is an area. The overview is its own URL, or the
 *   URL of its child named "Overview". The area holds every page below it.
 * - An overview at `<route>/<segment>/getting-started/overview` also names an area after
 *   `<segment>`, with dashes as spaces. It holds every sidebar page under `<route>/<segment>/`.
 * - When several areas share a name, the one with the fewest levels above it in the sidebar wins,
 *   then the first in sidebar order. A segment name only counts when no sidebar area has it.
 */
export function getSearchAreas(navigation: Navigation, route: string): Map<string, SearchArea> {
  const areas = new Map<string, SearchArea>();
  const depths = new Map<string, number>();
  const add = (name: string, overview: string, pages: string[], depth: number) => {
    const key = normalizeSearchText(name);
    if ((depths.get(key) ?? Number.POSITIVE_INFINITY) <= depth) return;
    depths.set(key, depth);
    areas.set(key, { name, overview, pages: new Set([overview, ...pages]) });
  };
  const walk = (entries: NavigationEntry[], depth: number) => {
    for (const entry of entries) {
      const overview = overviewUrl(entry);
      if (overview) add(entry.title, overview, pageUrls([entry]), depth);
      walk(entry.children ?? [], depth + 1);
    }
  };
  for (const tab of navigation.tabs) {
    add(tab.title, tab.url, pageUrls(tab.entries), 0);
    walk(tab.entries, 1);
  }

  const allPages = navigation.tabs.flatMap((tab) => pageUrls(tab.entries));
  const segmentOverview = new RegExp(`^${route}/([^/]+)/getting-started/overview$`);
  for (const url of allPages) {
    const segment = segmentOverview.exec(url)?.[1];
    if (!segment) continue;
    const prefix = `${route}/${segment}/`;
    add(
      segment.replaceAll('-', ' '),
      url,
      allPages.filter((page) => page.startsWith(prefix)),
      Number.MAX_SAFE_INTEGER,
    );
  }
  return areas;
}
