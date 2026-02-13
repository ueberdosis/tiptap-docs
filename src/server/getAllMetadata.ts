import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import frontmatter from 'front-matter'
import { cache } from 'react'
import { PageMeta } from '@/types'

/**
 * Loads ALL metadata - should only be used for build-time operations like sitemap generation.
 * WARNING: This reads all 558 MDX files and should NOT be called during regular page requests.
 */
export async function getAllMetadata() {
  let pages = await glob('**/*.mdx', { cwd: 'src/content' })

  let allMetadataEntries = (await Promise.all(
    pages.map(async (page) => {
      let pagePath = `/${page.replace(/(^|\/)page\.mdx$/, '')}`
      pagePath = pagePath.replace(/\/\([^)]+\)\/?/g, '/')

      const mdxContent = fs.readFileSync(path.join(process.cwd(), 'src/content', page), 'utf-8')
      const { attributes } = frontmatter(mdxContent) as {
        attributes: { meta: PageMeta | undefined }
      }

      return [pagePath, { ...attributes.meta, path: page }]
    }),
  )) as Array<[string, PageMeta & { path: string }]>

  let allMetadata = Object.fromEntries(allMetadataEntries)

  return allMetadata
}

/**
 * Lazy loads metadata for a single file path instead of all files.
 * Only reads the specific file needed, avoiding loading all 558 MDX files.
 * Cached per-request to avoid duplicate reads.
 */
export const getMetadataFromPath = cache(async (urlPath: string) => {
  // Convert URL path to possible file paths
  const directPath = `${urlPath.substring(1)}.mdx` // Remove leading slash
  const indexPath = `${urlPath.substring(1)}/index.mdx`

  // Try direct path first, then index path
  let filePath: string | null = null
  const directFullPath = path.join(process.cwd(), 'src/content', directPath)
  const indexFullPath = path.join(process.cwd(), 'src/content', indexPath)

  if (fs.existsSync(directFullPath)) {
    filePath = directFullPath
  } else if (fs.existsSync(indexFullPath)) {
    filePath = indexFullPath
  }

  if (!filePath) {
    return undefined
  }

  // Read only this single file
  const mdxContent = fs.readFileSync(filePath, 'utf-8')
  const { attributes } = frontmatter(mdxContent) as {
    attributes: { meta: PageMeta | undefined }
  }

  return attributes.meta
})
