import { ExtensionGrid } from './ExtensionGrid'
import { getExtensions } from '@/server/getExtensions'
import { ExtensionType } from '@/types'

export const Extensions = async ({
  path = '/',
  hideAll,
  hideFree,
}: {
  path?: string
  hideAll?: boolean
  hideFree?: boolean
}) => {
  const extensions = await getExtensions(path)

  const extensionsArray = Object.values(extensions)

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
