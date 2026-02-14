'use client'

import * as Dialog from '@radix-ui/react-dialog'
import React, { useCallback } from 'react'
import { DocsSidebar } from './SidebarRenderer'
import { useAppState } from '@/providers/AppState'
import { cn } from '@/utils'
import { SidebarConfig } from '@/types'

export const MobileSidebarNavigation = ({ config }: { config: SidebarConfig }) => {
  const { mobileNavigationOpen, setMobileNavigationOpen } = useAppState()

  const handleOnClick = useCallback(() => {
    setMobileNavigationOpen(false)
  }, [setMobileNavigationOpen])

  const overlayClassName = cn('fixed inset-0 bg-transparent z-[100] block')

  const contentClassName = cn(
    'fixed top-[7rem] left-3 max-h-[90vh] h-[calc(100dvh-8rem)] w-[calc(100vw-1.5rem)] md:max-w-[20rem] z-[101]',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-8',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-8',
    'data-[state=open]:duration-300 data-[state=closed]:duration-300',
  )

  return (
    <Dialog.Root open={mobileNavigationOpen} onOpenChange={setMobileNavigationOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClassName} />
        <Dialog.Content className={contentClassName}>
          <div className="px-4 p-8 rounded bg-white dark:bg-gray-900 shadow-lg h-full pointer-events-auto">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <DocsSidebar config={config} onItemClick={handleOnClick} />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
