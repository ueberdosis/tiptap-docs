/**
 * Redirects for old docs URLs, built from `src/lib/redirects.json` (old paths without `/docs`).
 * Reads the files on each call and does no other I/O.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { docsRoute, docsV2Route, siteUrl } from './shared.ts';

/** @typedef {{ source: string; destination: string; permanent: boolean }} Redirect */

export const redirectVersions = [
  { name: 'latest', route: docsRoute, dir: 'content/docs' },
  { name: 'v2', route: docsV2Route, dir: 'content/v2' },
];

/**
 * Returns the redirects of each version with app paths.
 * - Sources get the version route.
 * - A destination is a docs path when it is `/` or its first segment is a top-level folder of the
 *   version's content. It gets the version route. Any other destination becomes a URL on
 *   `https://tiptap.dev`.
 *
 * @param {string} appDir
 * @returns {{ name: string; route: string; dir: string; redirects: Redirect[] }[]}
 */
export function versionRedirects(appDir) {
  const lists = JSON.parse(readFileSync(join(appDir, 'src/lib/redirects.json'), 'utf8'));
  return redirectVersions.map((version) => {
    const folders = new Set(
      readdirSync(join(appDir, version.dir), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name),
    );
    /** @param {string} path */
    const withRoute = (path) => (path === '/' ? version.route : `${version.route}${path}`);
    /** @type {Redirect[]} */
    const redirects = lists[version.name].map(
      (/** @type {Redirect} */ { source, destination, permanent }) => {
        const first = destination.split(/[/?#]/)[1];
        const isDocs = first === '' || folders.has(first);
        return {
          source: withRoute(source),
          destination: isDocs ? withRoute(destination) : `${siteUrl}${destination}`,
          permanent,
        };
      },
    );
    return { ...version, redirects };
  });
}

/**
 * Adds `.md` to the path of a URL, before any `?query` or `#anchor`. Drops a trailing slash.
 *
 * @param {string} url
 */
const withMd = (url) => url.replace(/^([^?#]*?)\/?(?=$|[?#])/, '$1.md');

/**
 * Returns all redirects for `next.config.mjs`. Each redirect to a docs path comes after its `.md`
 * variant: old path + `.md` goes to new path + `.md`.
 *
 * @param {string} appDir
 * @returns {Redirect[]}
 */
export function appRedirects(appDir) {
  return versionRedirects(appDir).flatMap(({ redirects }) =>
    redirects.flatMap((redirect) =>
      redirect.destination.startsWith('/')
        ? [
            {
              ...redirect,
              source: withMd(redirect.source),
              destination: withMd(redirect.destination),
            },
            redirect,
          ]
        : [redirect],
    ),
  );
}
