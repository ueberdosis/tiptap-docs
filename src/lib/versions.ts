import { docsRoute, docsV2Route } from './shared';

export type VersionName = 'latest' | 'v2';

/** A docs version that this app serves. */
export type Version = { name: VersionName; label: string; route: string };

export const versions: Version[] = [
  { name: 'latest', label: '3.x', route: docsRoute },
  { name: 'v2', label: '2.x', route: docsV2Route },
];

/** The version an app URL belongs to. URLs outside the v2 route count as latest. */
export function getVersionName(pathname: string): VersionName {
  return pathname === docsV2Route || pathname.startsWith(`${docsV2Route}/`) ? 'v2' : 'latest';
}

/** The v1 docs, a separate site. */
export const legacyVersion = { label: '1.x', tag: 'Legacy', url: 'https://v1.tiptap.dev/' };

/** One entry of the version switcher. */
export type VersionLink = {
  label: string;
  tag?: string;
  url: string;
  external: boolean;
  active: boolean;
};

/**
 * The switcher entries for a page URL of `current`. Another served version links to the same page
 * path when it is in `sharedPaths` (page paths without the version route), else to its home.
 */
export function getVersionLinks(
  current: VersionName,
  pathname: string,
  sharedPaths: ReadonlySet<string>,
): VersionLink[] {
  const route = versions.find((version) => version.name === current)?.route ?? docsRoute;
  const path = pathname.startsWith(`${route}/`) ? pathname.slice(route.length + 1) : '';
  return [
    ...versions.map((version) => {
      const active = version.name === current;
      const samePage = path !== '' && (active || sharedPaths.has(path));
      return {
        label: version.label,
        url: samePage ? `${version.route}/${path}` : version.route,
        external: false,
        active,
      };
    }),
    {
      label: legacyVersion.label,
      tag: legacyVersion.tag,
      url: legacyVersion.url,
      external: true,
      active: false,
    },
  ];
}
