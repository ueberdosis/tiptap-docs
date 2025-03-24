import { glob } from 'fast-glob'
import { ExtensionMetaWithUrl } from '@/types'

export const getExtensions = async (path: string = '', version: string = '', subpath?: string) => {
  let pages = (await glob(`**/*.mdx`, { cwd: `src/content/${version}/${path}${subpath}` })).filter((p) => {
    return !p.endsWith('index.mdx') && !p.endsWith('overview.mdx')
  })

  const pathPrefix = path ? `${path}` : ''

  let allExtensions = (await Promise.all(
    pages.map(async (page) => {
      let pagePath = `${pathPrefix + subpath + '/' + page}`

      const extensionData = (await import(`@/content/${version}/${pagePath}`)).frontmatter
        ?.extension as ExtensionMetaWithUrl | undefined

      if (!extensionData) {
        return null
      }

      const url = `/${version}/${pagePath.replace('.mdx', '')}`

      return [
        path + subpath + pagePath,
        {
          ...extensionData,
          path: page,
          url,
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
