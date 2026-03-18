'use client'

import { useClipboard } from '@mantine/hooks'
import { CopyIcon } from 'lucide-react'
import { forwardRef, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { cn } from '@/utils'

export type CodeblockProps = {
  disableCopy?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Codeblock = forwardRef<HTMLDivElement, CodeblockProps>(
  ({ children, className, disableCopy, ...rest }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const wrapperClassName = cn(
      'bg-black text-white my-5 p-4 rounded-lg text-sm flex items-start gap-2',
      className,
    )

    const clipboard = useClipboard({ timeout: 500 })

    const onCopy = useCallback(() => {
      if (contentRef.current) {
        clipboard.copy(contentRef.current.textContent)
        toast('Copied to clipboard', { duration: 1200 })
      }
    }, [clipboard])

    return (
      <div className={wrapperClassName} {...rest} ref={ref}>
        <div ref={contentRef} className="self-center w-full overflow-auto max-h-[36rem]">
          {children}
        </div>
        {disableCopy ? null : (
          <button
            onClick={onCopy}
            className="flex items-center justify-center bg-white/0 border border-white/20 rounded size-8 hover:bg-white/10 hover:border-white/40"
          >
            <CopyIcon className="size-4" />
          </button>
        )}
      </div>
    )
  },
)

Codeblock.displayName = 'Codeblock'
