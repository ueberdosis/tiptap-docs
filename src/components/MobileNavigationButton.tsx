'use client'

import { ChevronDownIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { useAppState } from '@/providers/AppState'
import type { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'
import { Button } from './ui/Button'

export const MobileNavigationButton = ({ config }: { config?: SidebarConfig }) => {
  const { setMobileNavigationOpen } = useAppState()
  const pathName = usePathname()

  const currentItem = useMemo(() => {
    const flattenItems = (items: Array<SidebarLink | SidebarGroup>): SidebarLink[] => {
      return items.flatMap((item) => {
        if (item.type === 'group') {
          return flattenItems(item.children as SidebarLink[])
        }

        if (item.children) {
          return [item, ...flattenItems(item.children as SidebarLink[])]
        }
        return [item]
      })
    }

    const items = flattenItems(config?.items ?? [])
    return items.find((item) => item.href === pathName)
  }, [config, pathName])

  return (
    <Button
      variant="tertiary"
      className="font-normal text-base leading-[110%]"
      size="small"
      onClick={() => setMobileNavigationOpen(true)}
    >
      {currentItem?.title ?? 'Navigation'}
      <ChevronDownIcon className="w-2 h-2" />
    </Button>
  )
}
