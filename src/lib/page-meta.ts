/** Frontmatter fields that hold a page's title and description. */
export type PageMetaFields = {
  title?: string;
  description?: string;
  meta?: { title?: string; description?: string | null };
};

/**
 * Title for the browser tab, search engines and link previews: `meta.title`, else `title`.
 * Empty strings count as missing.
 */
export function pageMetaTitle(data: PageMetaFields): string | undefined {
  return data.meta?.title || data.title || undefined;
}

/**
 * Description for search engines, link previews and the AI chat: `meta.description`, else
 * `description`. Empty strings count as missing.
 */
export function pageMetaDescription(data: PageMetaFields): string | undefined {
  return data.meta?.description || data.description || undefined;
}
