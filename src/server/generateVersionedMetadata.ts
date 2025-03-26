import fs from 'fs'
import { createCanonicalUrl } from './createCanonicalUrl'
import { createMetadata } from './createMetadata'
import { getImportPathForVersion, importMdxFromPath } from '@/utils/versioning'

export async function generateVersionedMetadata(path: string[], version: string) {
  const directPath = `${path.join('/')}.mdx`
  const indexPath = path.length > 0 ? `${path.join('/')}/index.mdx` : 'index.mdx'

  const canonicalUrl = createCanonicalUrl(path)

  const hasDirectMdx = fs.existsSync(getImportPathForVersion(version, directPath))
  const hasIndexMdx = fs.existsSync(getImportPathForVersion(version, indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    // Return a 404 page if the markdown file doesn't exist
    // give Next error page
    return {}
  }

  const pageMdx = await importMdxFromPath(version, hasDirectMdx ? directPath : indexPath)

  return await createMetadata({
    title: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    category: pageMdx.frontmatter?.meta?.category,
    ogTitle: pageMdx.frontmatter?.title ?? '',
    canonicalUrl,
  })
}
