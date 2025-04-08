import { glob } from 'fast-glob'
import { UIComponentMetaWithUrl } from '@/types'

export const getUIComponents = async (path: string = '') => {
  let pages = (await glob(`**/*.mdx`, { cwd: `src/${path}` })).filter((p) => {
    return !p.endsWith('index.mdx') && !p.endsWith('overview.mdx')
  })

  const pathPrefix = path ? `${path}/` : ''

  let allComponents = (await Promise.all(
    pages.map(async (page) => {
      const pagePath = `/${pathPrefix + page}`
      const componentData = (await import(`@/content/${pagePath.replace('/content/', '')}`))
        .frontmatter?.component as UIComponentMetaWithUrl | undefined

      if (!componentData) {
        return null
      }

      return [
        path + pagePath,
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
}
