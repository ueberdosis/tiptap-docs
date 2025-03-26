import { MetadataRoute } from 'next'
import { getAllContentPaths } from '@/server/getAllContentPaths'
import { FULL_DOMAIN, VERSIONS } from '@/utils/constants'
import { getRecentVersion } from '@/utils/versioning'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getAllContentPaths({ withoutIndex: true })
  const recentVersion = getRecentVersion(VERSIONS)

  const pathEntries = paths.map((path) => {
    const isRecentVersion = recentVersion ? path.includes(recentVersion.version) : false

    if (isRecentVersion && recentVersion) {
      path = path.replace(`${recentVersion.version}/`, '')
    }

    return {
      url: `${FULL_DOMAIN}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  }) as MetadataRoute.Sitemap

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
