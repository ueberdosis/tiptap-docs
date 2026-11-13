import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter'
import { searchParameters } from './searchParameters'

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
  additionalSearchParameters: searchParameters,
})
