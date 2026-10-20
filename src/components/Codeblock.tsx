'use client'

import { useClipboard } from '@mantine/hooks'
import { CopyIcon, CheckIcon } from 'lucide-react'
import { forwardRef, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { CODE_COLLAPSED_HEIGHT, CodeCollapseBar, useCodeCollapse } from './CodeCollapse'
import { cn } from '@/utils'

export type CodeblockProps = {
  disableCopy?: boolean
  /** Long code shows its first 28rem and a "Show all" bar; `false` shows it all. */
  collapse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Codeblock = forwardRef<HTMLDivElement, CodeblockProps>(
  ({ children, className, disableCopy, collapse = true, ...rest }, ref) => {
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [collapseRef, collapsible] = useCodeCollapse<HTMLDivElement>(
      collapse ? CODE_COLLAPSED_HEIGHT : null,
    )
    const wrapperClassName = cn(
      'c-codeblock bg-black text-white my-5 p-4 rounded-lg text-sm relative items-start gap-2',
      // A single line centers the copy button on it; longer code keeps it at the top
      '[&:has(.line:only-child)>.c-codeblock-copy]:top-1/2 [&:has(.line:only-child)>.c-codeblock-copy]:-translate-y-1/2',
      className,
    )

    const clipboard = useClipboard({ timeout: 1200 })

    const onCopy = useCallback(() => {
      if (contentRef.current) {
        clipboard.copy(contentRef.current.textContent)
        toast('Copied to clipboard', { duration: 1200 })
      }
    }, [clipboard])

    return (
      <div className={wrapperClassName} {...rest} ref={ref}>
        <div
          ref={(element) => {
            contentRef.current = element
            collapseRef.current = element
          }}
          className={collapsible.isCollapsed ? 'overflow-auto' : 'overflow-x-auto'}
          style={collapsible.isCollapsed ? { maxHeight: CODE_COLLAPSED_HEIGHT } : undefined}
        >
          {children}
        </div>
        {collapsible.hasBar ? (
          <CodeCollapseBar
            isOpen={collapsible.isOpen}
            isFaded={collapsible.isFaded}
            onToggle={collapsible.toggle}
            className="-mx-4 -mb-4 mt-3 w-[calc(100%+2rem)] rounded-b-lg"
          />
        ) : null}
        {disableCopy ? null : (
          <button
            onClick={onCopy}
            aria-label={clipboard.copied ? 'Copied' : 'Copy code'}
            className="c-codeblock-copy absolute top-2 right-2 flex items-center justify-center bg-black border border-white/20 rounded size-7 hover:bg-white/10 hover:border-white/40 transition-colors duration-200"
          >
            <span className="relative size-3.5">
              <CopyIcon
                className={cn(
                  'absolute inset-0 size-3.5 transition-all duration-200 ease-out',
                  clipboard.copied
                    ? 'opacity-0 scale-75 -rotate-12'
                    : 'opacity-100 scale-100 rotate-0',
                )}
              />
              <CheckIcon
                className={cn(
                  'absolute inset-0 size-3.5 transition-all duration-200 ease-out',
                  clipboard.copied
                    ? 'opacity-100 scale-100 rotate-0'
                    : 'opacity-0 scale-75 rotate-12',
                )}
              />
            </span>
          </button>
        )}
      </div>
    )
  },
)

Codeblock.displayName = 'Codeblock'
