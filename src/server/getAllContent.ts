import fg from 'fast-glob'
import { cache } from 'react'

/**
 * Gets all content MDX files from the content directory via fast-glob.
 * Cached per-request to avoid duplicate file system scans.
 */
export const getAllContent = cache(async () => {
  const files = await fg('src/content/**/*.mdx')

  return files
})
