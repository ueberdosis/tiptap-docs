import { MetadataRoute } from 'next'
import { getAllContentPaths } from '@/server/getAllContentPaths'
import { FULL_DOMAIN } from '@/utils/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getAllContentPaths({ withoutIndex: true })

  const pathEntries = paths.map((path: string) => ({
    url: `${FULL_DOMAIN}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  })) as MetadataRoute.Sitemap

  return [
    // HOME ROUTE
    {
      url: `${FULL_DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...pathEntries,
  ]
}
