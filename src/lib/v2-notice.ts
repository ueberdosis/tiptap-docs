import { docsRoute } from './shared';
import notice from './v2-notice.json';

/** The imported v2 notice bar: a text and an app URL, or `null` for no bar. */
export type V2Notice = { text: string; url: string } | null;

export const v2Notice = notice as V2Notice;

/** The notice on one v2 page: optional plain text, then a link. */
export type V2PageNotice = { text?: string; linkText: string; url: string };

/**
 * The notice for a v2 page path (without the version route). A path in `sharedPaths` links to the
 * same page on latest, any other path gets the imported notice. `null` when there is none.
 */
export function getV2PageNotice(
  path: string,
  sharedPaths: ReadonlySet<string>,
): V2PageNotice | null {
  if (path !== '' && sharedPaths.has(path)) {
    return {
      text: 'This page is for Tiptap 2.x.',
      linkText: 'See the latest version of this page.',
      url: `${docsRoute}/${path}`,
    };
  }
  return v2Notice && { linkText: v2Notice.text, url: v2Notice.url };
}
