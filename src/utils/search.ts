import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter'

export const typesenseAdapter = new TypesenseInstantsearchAdapter({
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
    group_by: 'url',
    group_limit: 1,
    query_by:
      'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,hierarchy.lvl6',
  },
})
