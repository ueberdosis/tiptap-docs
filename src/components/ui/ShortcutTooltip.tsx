'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** What a control does, and the keys that do the same, such as `['Next match', ['↵']]`. */
export type Shortcut = [action: string, keys?: string[]]

/**
 * Names a control and its keyboard shortcuts on hover or keyboard focus. It sits on
 * the page, outside the sidebar's scrolling, so nothing cuts it off.
 */
export function ShortcutTooltip({
  shortcuts,
  children,
}: {
  shortcuts: Shortcut[]
  children: React.ReactNode
}) {
  const trigger = useRef<HTMLSpanElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number }>()
  const timer = useRef<number>(undefined)

  const show = () => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const rect = trigger.current?.getBoundingClientRect()
      if (rect) setPosition({ top: rect.bottom + 6, left: rect.left + rect.width / 2 })
    }, 400)
  }
  const hide = () => {
    window.clearTimeout(timer.current)
    setPosition(undefined)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <span
      ref={trigger}
      className="inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={(event) => event.target.matches(':focus-visible') && show()}
      onBlur={hide}
      onClick={hide}
    >
      {children}
      {position
        ? createPortal(
            <span
              role="tooltip"
              style={{ top: position.top, left: position.left }}
              className="fixed z-50 -translate-x-1/2 flex flex-col gap-1.5 min-w-40 px-3 py-2 rounded-lg bg-neutral-950 text-white text-xs shadow-lg pointer-events-none"
            >
              {shortcuts.map(([action, keys]) => (
                <span key={action} className="flex items-center justify-between gap-4">
                  <span className="whitespace-nowrap">{action}</span>
                  {keys?.length ? (
                    <span className="flex gap-1">
                      {keys.map((key) => (
                        <kbd
                          key={key}
                          className="grid place-items-center min-w-5 h-5 px-1 rounded border border-white/25 font-sans text-[11px] text-white/80"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  ) : null}
                </span>
              ))}
            </span>,
            document.body,
          )
        : null}
    </span>
  )
}
