import { glob } from 'fast-glob'
import { ExtensionMetaWithUrl } from '@/types'

export const getExtensions = async (path: string = '') => {
  let pages = (await glob(`**/*.mdx`, { cwd: `src/${path}` })).filter((p) => {
    return !p.endsWith('index.mdx') && !p.endsWith('overview.mdx')
  })

  const pathPrefix = path ? `${path}/` : ''

  let allExtensions = (await Promise.all(
    pages.map(async (page) => {
      let pagePath = `/${pathPrefix + page}`

      const extensionData = (await import(`@/content/${pagePath.replace('/content/', '')}`))
        .frontmatter?.extension as ExtensionMetaWithUrl | undefined

      if (!extensionData) {
        return null
      }

      return [
        path + pagePath,
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
}
