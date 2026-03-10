import fs from 'fs'
import path from 'path'
import { glob } from 'fast-glob'
import { cache } from 'react'
import frontmatter from 'front-matter'
import { UIComponentMetaWithUrl, PageFrontmatter } from '@/types'

/**
 * Gets all UI components from MDX files.
 * Reads frontmatter directly from files instead of compiling MDX for better performance.
 * Cached per-request to avoid duplicate file reads.
 */
export const getUIComponents = cache(async (pathParam: string = '') => {
  let pages = (await glob(`**/*.mdx`, { cwd: `src/${pathParam}` })).filter((p) => {
    return !p.endsWith('index.mdx') && !p.endsWith('overview.mdx')
  })

  const pathPrefix = pathParam ? `${pathParam}/` : ''

  let allComponents = (await Promise.all(
    pages.map(async (page) => {
      const pagePath = `/${pathPrefix + page}`

      // Read frontmatter directly without compiling MDX - much faster and less memory
      const filePath = path.join(process.cwd(), 'src', pathPrefix + page)
      const mdxContent = fs.readFileSync(filePath, 'utf-8')
      const { attributes } = frontmatter(mdxContent) as { attributes: PageFrontmatter }

      const componentData = attributes.component as UIComponentMetaWithUrl | undefined

      if (!componentData) {
        return null
      }

      return [
        pathParam + pagePath,
        {
          ...componentData,
          path: page,
          url: pagePath.replace('content/', '').replace('.mdx', ''),
        },
      ] as [string, UIComponentMetaWithUrl]
    }),
  )) as Array<[string, UIComponentMetaWithUrl]>

  allComponents = allComponents
    .filter((entry): entry is [string, UIComponentMetaWithUrl] => entry !== null)
    .sort((a, b) => {
      const nameA = a[1].name.toLowerCase()
      const nameB = b[1].name.toLowerCase()
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    })

  const componentsData = Object.fromEntries(allComponents)
  return componentsData
})
