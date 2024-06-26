import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import frontmatter from 'front-matter'
import { PageMeta } from '@/types'

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

export const getMetadataFromPath = async (path: string) => {
  return (await getAllMetadata())[path] || undefined
}
