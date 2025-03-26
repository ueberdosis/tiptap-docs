import fs from 'fs'
import { notFound } from 'next/navigation'
import { getImportPathForVersion, importMdxFromPath } from '@/utils/versioning'
import type { SidebarConfig } from '@/types'

/**
 * Gets a versioned MDX file and it's sidebar configuration for a path, if not redirects to 404
 * @param path A array of path segments to the MDX file
 * @param version The version of the MDX file
 * @returns The MDX file and it's sidebar configuration
 */
export async function getVersionedMdx(path: string[], version: string) {
  const directPath = `${path.join('/')}.mdx`
  const indexPath = path.length > 0 ? `${path.join('/')}/index.mdx` : 'index.mdx'

  let sidebar: SidebarConfig | null = null
  let steppedSegments = []

  ;['', ...path].forEach((segment) => {
    steppedSegments.push(segment)

    const filePath = getImportPathForVersion(version, ...steppedSegments, 'sidebar.ts')

    const fileExists = fs.existsSync(filePath)

    if (fileExists) {
      const isIndex = steppedSegments[steppedSegments.length - 1] === ''
      const importPath = isIndex
        ? 'sidebar'
        : `${steppedSegments.filter((s) => s !== '').join('/')}/sidebar`
      sidebar = require(`@/content/${version}/${importPath}`).sidebarConfig as SidebarConfig
    }
  })

  const hasDirectMdx = fs.existsSync(getImportPathForVersion(version, directPath))
  const hasIndexMdx = fs.existsSync(getImportPathForVersion(version, indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    // Return a 404 page if the markdown file doesn't exist
    // give Next error page
    notFound()
  }

  const pageMdx = await importMdxFromPath(version, hasDirectMdx ? directPath : indexPath)

  return { mdx: pageMdx, sidebar: sidebar as SidebarConfig | null }
}
