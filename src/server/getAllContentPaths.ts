import { cache } from 'react'
import { getAllContent } from './getAllContent'

/**
 * Get all content paths from the content directory
 * MDX paths are replaced to URL paths
 * f.e. src/content/about/license.mdx => /about/license
 * Cached per-request to avoid duplicate processing.
 */
export const getAllContentPaths = cache(async (options?: { withoutIndex?: boolean }) => {
  const allFiles = await getAllContent()

  const allPaths = allFiles
    .map((file) => {
      let path = file.replace('src/content', '').replace('.mdx', '').replace('index', '')

      if (path.at(-1) === '/') {
        path = path.slice(0, -1)
      }

      return path
    })
    .filter((path) => {
      if (path === '' && options?.withoutIndex) {
        return false
      }

      return true
    })

  return allPaths
})
