import { ExtensionGrid } from './ExtensionGrid'
import { getExtensions } from '@/server/getExtensions'
import { ExtensionType } from '@/types'

export const Extensions = async ({
  path = '/',
  subpath = '',
  version = '',
  hideVersion,
  hideAll,
  hideFree,
}: {
  path?: string
  subpath?: string
  version?: string
  /**
   * Hide the version from the URL
   */
  hideVersion?: boolean
  hideAll?: boolean
  hideFree?: boolean
}) => {
  const extensions = await getExtensions(path, version, subpath)

  const extensionsArray = Object.values(extensions)

  if (hideVersion) {
    extensionsArray.forEach((ext) => {
      ext.url = ext.url.replace(`/${version}`, '')
    })
  }

  const nodeExtensions = extensionsArray.filter((ext) => ext.type === ExtensionType.Node)
  const markExtensions = extensionsArray.filter((ext) => ext.type === ExtensionType.Mark)
  const functionalityExtensions = extensionsArray.filter(
    (ext) => ext.type === ExtensionType.Functionality,
  )

  return (
    <div className="my-20 first:mt-0 last:mb-0">
      <ExtensionGrid
        functionalityExtensions={functionalityExtensions}
        markExtensions={markExtensions}
        nodeExtensions={nodeExtensions}
        hideAll={hideAll}
        hideFree={hideFree}
      />
    </div>
  )
}
