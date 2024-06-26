'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useCallback } from 'react'
import { TableOfContent } from './TableOfContent'
import { useAppState } from '@/providers/AppState'
import { cn } from '@/utils'
import { useToC } from '@/hooks/useToC'

export const MobileTableOfContent = () => {
  const { headlines, activeId } = useToC()
  const { mobileTocOpen, setMobileTocOpen } = useAppState()

  const handleOnClick = useCallback(() => {
    setMobileTocOpen(false)
  }, [setMobileTocOpen])

  if (!headlines.length) return null

  const overlayClassName = cn('fixed inset-0 bg-transparent z-[100] block')

  const contentClassName = cn(
    'fixed top-[7rem] lg:top-[4.5rem] max-h-[calc(100dvh-8rem)] lg:max-h-[calc(100%-4.5rem)] right-3 w-full max-w-[20rem] z-[101]',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-8',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-8',
    'data-[state=open]:duration-300 data-[state=closed]:duration-300',
  )

  return (
    <Dialog.Root open={mobileTocOpen} onOpenChange={setMobileTocOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClassName} />
        <Dialog.Content className={contentClassName}>
          <div className="px-4 py-8 rounded bg-white shadow-lg h-full pointer-events-auto">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <TableOfContent onClick={handleOnClick} headlines={headlines} activeId={activeId} />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
