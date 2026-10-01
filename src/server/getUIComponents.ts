import path from 'path'
import { glob } from 'fast-glob'
import { cache } from 'react'
import { readFrontmatter } from './readFrontmatter'
import type { UIComponentMetaWithUrl } from '@/types'

export const getUIComponents = cache(async (pathParam: string = '') => {
  const pages = (await glob('**/*.mdx', { cwd: `src/${pathParam}` })).filter(
    (page) => !page.endsWith('index.mdx') && !page.endsWith('overview.mdx'),
  )
  const pathPrefix = pathParam ? `${pathParam}/` : ''
  const entries: [string, UIComponentMetaWithUrl][] = []

  for (const page of pages) {
    const pagePath = `/${pathPrefix}${page}`
    const attributes = await readFrontmatter(path.join(process.cwd(), 'src', pathPrefix, page))
    if (!attributes.component) continue

    entries.push([
      `${pathParam}${pagePath}`,
      {
        ...attributes.component,
        path: page,
        url: pagePath.replace('content/', '').replace('.mdx', ''),
      },
    ])
  }

  entries.sort((a, b) => {
    const nameA = a[1].name.toLowerCase()
    const nameB = b[1].name.toLowerCase()
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
  })
  return Object.fromEntries(entries)
})
