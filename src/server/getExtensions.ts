import fs from 'fs'
import path from 'path'
import { glob } from 'fast-glob'
import { cache } from 'react'
import frontmatter from 'front-matter'
import { ExtensionMetaWithUrl, PageFrontmatter } from '@/types'

/**
 * Gets all extensions from MDX files.
 * Reads frontmatter directly from files instead of compiling MDX for better performance.
 * Cached per-request to avoid duplicate file reads.
 */
export const getExtensions = cache(async (pathParam: string = '') => {
  let pages = (await glob(`**/*.mdx`, { cwd: `src/${pathParam}` })).filter((p) => {
    return !p.endsWith('index.mdx') && !p.endsWith('overview.mdx')
  })

  const pathPrefix = pathParam ? `${pathParam}/` : ''

  let allExtensions = (await Promise.all(
    pages.map(async (page) => {
      let pagePath = `/${pathPrefix + page}`

      // Read frontmatter directly without compiling MDX - much faster and less memory
      const filePath = path.join(process.cwd(), 'src', pathPrefix + page)
      const mdxContent = fs.readFileSync(filePath, 'utf-8')
      const { attributes } = frontmatter(mdxContent) as { attributes: PageFrontmatter }

      const extensionData = attributes.extension as ExtensionMetaWithUrl | undefined
      const pageTags = attributes.tags || []

      if (!extensionData) {
        return null
      }

      // Check if the page has a beta tag in the frontmatter
      const hasBetaTag = pageTags.some(
        (tag: { type: string }) => typeof tag === 'object' && tag.type === 'beta',
      )

      // If beta tag is present, mark extension as new
      if (hasBetaTag && !extensionData.isNew) {
        extensionData.isNew = true
      }

      // Check for 'start' and 'team' tag types and add corresponding tags to the extension
      const hasStartTag = pageTags.some(
        (tag: { type: string }) => typeof tag === 'object' && tag.type === 'start',
      )

      const hasTeamTag = pageTags.some(
        (tag: { type: string }) => typeof tag === 'object' && tag.type === 'team',
      )

      const hasAddonTag = pageTags.some(
        (tag: { type: string }) => typeof tag === 'object' && tag.type === 'addon',
      )

      // Initialize tags array if it doesn't exist
      if (!extensionData.tags) {
        extensionData.tags = []
      }

      // Add "Start" tag if start type is present
      if (hasStartTag && !extensionData.tags.includes('Start')) {
        extensionData.tags.push('Start')
      }

      // Add "Team" tag if team type is present
      if (hasTeamTag && !extensionData.tags.includes('Team')) {
        extensionData.tags.push('Team')
      }

      // Add "Addon" tag if addon type is present
      if (hasAddonTag && !extensionData.tags.includes('Addon')) {
        extensionData.tags.push('Addon')
      }

      return [
        pathParam + pagePath,
        {
          ...extensionData,
          path: page,
          url: pagePath.replace('content/', '').replace('.mdx', ''),
        },
      ]
    }),
  )) as Array<[string, ExtensionMetaWithUrl]>

  allExtensions = allExtensions
    .filter((ext) => ext !== null)
    .sort((extA, extB) => {
      if (extA[1].name < extB[1].name) {
        return -1
      }
      if (extA[1].name > extB[1].name) {
        return 1
      }
      return 0
    })

  const extensionData = Object.fromEntries(allExtensions)

  return extensionData
})
