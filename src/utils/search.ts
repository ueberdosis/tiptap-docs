import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter'

// Default weights: hierarchy.lvl0 gets highest weight, then progressively lower for sub-headings
// Can be overridden via NEXT_PUBLIC_SEARCH_WEIGHTS env var (comma-separated, e.g. "20,10,6,4,3,2,1,1")
const DEFAULT_WEIGHTS = '30,12,6,3,2,1,1,1'

const options = {
  server: {
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_DOCSEARCH_HOST || '',
        port: process.env.NEXT_PUBLIC_DOCSEARCH_PORT
          ? parseInt(process.env.NEXT_PUBLIC_DOCSEARCH_PORT)
          : 443,
        protocol: process.env.NEXT_PUBLIC_DOCSEARCH_PROTOCOL || 'https',
      },
    ],
    apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY || '',
    cacheSearchResultsForSeconds: 2 * 60,
  },
  additionalSearchParameters: {
    group_by: process.env.NEXT_PUBLIC_SEARCH_GROUP_BY || 'url_without_anchor',
    group_limit: 1,
    query_by:
      'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,hierarchy.lvl6,content',
    query_by_weights: process.env.NEXT_PUBLIC_SEARCH_WEIGHTS || DEFAULT_WEIGHTS,
    prioritize_exact_match: true,
    // More lenient token matching - helps with partial word matches
    drop_tokens_threshold: 0,
    // Prefer prefix matches (e.g. "install" matches "installation")
    prefix: 'true,true,true,true,true,true,true,false',
    num_typos: 1,
    min_len_1typo: 5,
    min_len_2typo: 9,
  },
}

export const typesenseAdapter = new TypesenseInstantsearchAdapter(options)

/**
 * The sidebar search groups by page as well, but keeps up to three sections of each,
 * nested under the page's first hit as `_grouped_hits`.
 */
export const sidebarSearchAdapter = new TypesenseInstantsearchAdapter({
  ...options,
  flattenGroupedHits: false,
  additionalSearchParameters: { ...options.additionalSearchParameters, group_limit: 3 },
})
