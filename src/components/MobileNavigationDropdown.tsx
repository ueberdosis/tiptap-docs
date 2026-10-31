'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DOCS_AREAS, activeDocsArea } from './DocsSwitcher'
import { NavLink } from './NavLink'

const itemClass = 'text-lg px-4 py-3 rounded-xl'

/** Four dots in a square, like the menu button on tiptap.dev. */
const MenuIcon = () => (
  <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
    <circle cx="4.5" cy="4.5" r="1.75" />
    <circle cx="11.5" cy="4.5" r="1.75" />
    <circle cx="4.5" cy="11.5" r="1.75" />
    <circle cx="11.5" cy="11.5" r="1.75" />
  </svg>
)

/** The width of the header bar, and how far its right edge lies past the button's. */
function frameOf(trigger: HTMLElement | null) {
  const bar = trigger?.closest('[data-header-bar]')
  if (!trigger || !bar) return undefined
  const { width, right } = bar.getBoundingClientRect()
  return { width, offset: right - trigger.getBoundingClientRect().right }
}

/** The phone menu: the areas of the docs, the website and sign up, behind one button. */
export const MobileNavigationDropdown = () => {
  const active = activeDocsArea(usePathname())
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  // The menu spans the header bar and lines up with its right edge
  const [frame, setFrame] = useState({ width: 0, offset: 0 })

  // Follows the header when the screen turns or resizes while the menu is open
  useEffect(() => {
    const bar = trigger.current?.closest('[data-header-bar]')
    if (!open || !bar) return
    const observer = new ResizeObserver(() => {
      const next = frameOf(trigger.current)
      if (next) setFrame(next)
    })
    observer.observe(bar)
    return () => observer.disconnect()
  }, [open])

  const changeOpen = (next: boolean) => {
    const measured = next ? frameOf(trigger.current) : undefined
    if (measured) setFrame(measured)
    setOpen(next)
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={changeOpen}>
      <DropdownMenu.Trigger
        ref={trigger}
        aria-label="Menu"
        className="flex items-center justify-center size-9 rounded-xl bg-white hover:bg-grayAlpha-100 data-[state=open]:bg-grayAlpha-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        <MenuIcon />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          alignOffset={-frame.offset}
          sideOffset={14}
          style={{ width: frame.width || undefined }}
          className="z-50 flex flex-col gap-1 p-2 text-black bg-white rounded-pilled shadow-lg"
        >
          {DOCS_AREAS.map((area) => (
            <DropdownMenu.Item key={area.href} asChild>
              <NavLink
                href={area.href}
                isDirectActive
                isActive={area === active}
                className={itemClass}
              >
                {area.label}
              </NavLink>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Item asChild>
            <NavLink href="https://tiptap.dev" target="_blank" className={itemClass}>
              Website
            </NavLink>
          </DropdownMenu.Item>
          {/* Only where the header has no room for it */}
          <DropdownMenu.Item asChild className="min-[390px]:hidden">
            <NavLink
              variant="invert"
              href="https://cloud.tiptap.dev/register"
              target="_blank"
              className="justify-center mt-2 py-2.5 rounded-xl"
              hideIcon
            >
              Sign up
            </NavLink>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
