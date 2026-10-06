import path from 'path'
import { glob } from 'fast-glob'
import { cache } from 'react'
import { readFrontmatter } from './readFrontmatter'
import type { ExtensionMetaWithUrl } from '@/types'

export const getExtensions = cache(async (pathParam: string = '') => {
  const pages = (await glob('**/*.mdx', { cwd: `src/${pathParam}` })).filter(
    (page) => !page.endsWith('index.mdx') && !page.endsWith('overview.mdx'),
  )
  const pathPrefix = pathParam ? `${pathParam}/` : ''
  const entries: [string, ExtensionMetaWithUrl][] = []

  for (const page of pages) {
    const pagePath = `/${pathPrefix}${page}`
    const attributes = await readFrontmatter(path.join(process.cwd(), 'src', pathPrefix, page))
    const extension = attributes.extension
    if (!extension) continue

    const pageTags = attributes.tags ?? []
    const tags = [...(extension.tags ?? [])]
    for (const [type, label] of [
      ['start', 'Start'],
      ['team', 'Team'],
      ['addon', 'Addon'],
    ]) {
      if (pageTags.some((tag) => tag.type === type) && !tags.includes(label)) {
        tags.push(label)
      }
    }

    entries.push([
      `${pathParam}${pagePath}`,
      {
        ...extension,
        tags,
        ...(pageTags.some((tag) => tag.type === 'beta') ? { isNew: true } : {}),
        path: page,
        url: pagePath.replace('content/', '').replace('.mdx', ''),
      },
    ])
  }

  entries.sort((a, b) => (a[1].name < b[1].name ? -1 : a[1].name > b[1].name ? 1 : 0))
  return Object.fromEntries(entries)
})
