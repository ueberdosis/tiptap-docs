'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'

/** How much of a code block shows before "Show all", across the docs. */
export const CODE_COLLAPSED_HEIGHT = 448

/**
 * Long code shows its first `collapsedHeight` pixels and a "Show all" bar. The reader may also
 * scroll inside the box instead; the fade above the bar goes once the end is reached. The ref goes on the element that clips the code; the bar only shows when
 * there is more than fits, so short code gets none. Null for `collapsedHeight` shows it all.
 */
export const useCodeCollapse = <T extends HTMLElement>(collapsedHeight: number | null) => {
  const ref = useRef<T | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const isCollapsed = collapsedHeight !== null && !isOpen

  useEffect(() => {
    const element = ref.current
    if (!element || !isCollapsed) return
    const measure = () => {
      setOverflows(element.scrollHeight > element.clientHeight + 1)
      setAtEnd(element.scrollTop + element.clientHeight >= element.scrollHeight - 1)
    }
    element.addEventListener('scroll', measure, { passive: true })
    // The code may change after the first render (highlighting, another file, text in place)
    const resize = new ResizeObserver(measure)
    resize.observe(element)
    const mutation = new MutationObserver(measure)
    mutation.observe(element, { childList: true, characterData: true, subtree: true })
    measure()
    return () => {
      element.removeEventListener('scroll', measure)
      resize.disconnect()
      mutation.disconnect()
    }
  }, [isCollapsed])

  // The ref apart from the state, so reading the state isn't reading a ref
  return [
    ref,
    {
      isOpen,
      isCollapsed,
      isFaded: isCollapsed && !atEnd,
      hasBar: collapsedHeight !== null && (overflows || isOpen),
      toggle: () => setIsOpen((open) => !open),
    },
  ] as const
}

/** The bar below collapsed code, with a fade above it that says there is more. */
export const CodeCollapseBar = ({
  isOpen,
  isFaded = !isOpen,
  onToggle,
  className,
}: {
  isOpen: boolean
  /** The fade that says more code follows; off once the reader scrolled to the end. */
  isFaded?: boolean
  onToggle: () => void
  className?: string
}) => (
  <button
    type="button"
    aria-expanded={isOpen}
    onClick={onToggle}
    className={cn(
      'relative flex w-full shrink-0 items-center justify-center gap-1.5 border-t border-whiteAlpha-100 py-2 text-xs font-semibold text-whiteAlpha-700 transition-colors hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600',
      !isFaded
        ? undefined
        : 'before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-12 before:bg-linear-to-t before:from-black before:to-transparent',
      className,
    )}
  >
    {isOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
    {isOpen ? 'Show less' : 'Show all'}
  </button>
)
