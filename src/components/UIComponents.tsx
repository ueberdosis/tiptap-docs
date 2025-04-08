import { UIComponentsGrid } from './UIComponentsGrid'
import { getUIComponents } from '@/server/getUIComponents'
import { UIComponentType } from '@/types'

export const UIComponents = async ({
  path = '/',
  hideAll,
  hideFree,
}: {
  path?: string
  hideAll?: boolean
  hideFree?: boolean
}) => {
  const uiComponents = await getUIComponents(path)
  const componentsArray = Object.values(uiComponents)

  const components = componentsArray.filter((c) => c.type === UIComponentType.Component)
  const nodeComponents = componentsArray.filter((c) => c.type === UIComponentType.NodeComponent)
  const primitives = componentsArray.filter((c) => c.type === UIComponentType.Primitive)

  return (
    <div className="my-20 first:mt-0 last:mb-0">
      <UIComponentsGrid
        components={components}
        nodeComponents={nodeComponents}
        primitives={primitives}
        hideAll={hideAll}
        hideFree={hideFree}
      />
    </div>
  )
}
