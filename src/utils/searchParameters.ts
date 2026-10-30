// What the docs search asks Typesense. The search dialog and
// `scripts/search/check-ranking.ts` share it, so the test set ranks like the site.

// One weight per field of `query_by`: lvl0 (the area, such as "Editor"), lvl1 (the
// page title), lvl2–lvl6 (headings), then content. The page title counts most; the
// area only a little, as every page of an area carries it.
// Can be overridden via NEXT_PUBLIC_SEARCH_WEIGHTS env var (comma-separated, e.g. "5,30,15,8,4,2,1,1")
const DEFAULT_WEIGHTS = '5,30,15,8,4,2,1,1'

// Matches of about the same quality fall into one of ten buckets; inside a bucket,
// the scraper's item_priority decides. It comes from the page_rank in
// docsearch.config.json first, which puts Legacy pages and changelogs last.
// Can be overridden via NEXT_PUBLIC_SEARCH_SORT_BY env var
const DEFAULT_SORT_BY = '_text_match(buckets: 10):desc,item_priority:desc'

export const searchParameters = {
  group_by: process.env.NEXT_PUBLIC_SEARCH_GROUP_BY || 'url_without_anchor',
  group_limit: 1,
  query_by:
    'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,hierarchy.lvl6,content',
  query_by_weights: process.env.NEXT_PUBLIC_SEARCH_WEIGHTS || DEFAULT_WEIGHTS,
  sort_by: process.env.NEXT_PUBLIC_SEARCH_SORT_BY || DEFAULT_SORT_BY,
  prioritize_exact_match: true,
  // More lenient token matching - helps with partial word matches
  drop_tokens_threshold: 0,
  // Prefer prefix matches (e.g. "install" matches "installation")
  prefix: 'true,true,true,true,true,true,true,false',
  num_typos: 1,
  min_len_1typo: 5,
  min_len_2typo: 9,
}
