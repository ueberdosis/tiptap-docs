'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { usePathname } from 'next/navigation'
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

/** The phone menu: the areas of the docs, the website and sign up, behind one button. */
export const MobileNavigationDropdown = () => {
  const active = activeDocsArea(usePathname())

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Menu"
        className="flex items-center justify-center size-9 rounded-xl bg-grayAlpha-100 hover:bg-grayAlpha-200 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        <MenuIcon />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={14}
          // Keeps the same 10px from the screen edge as the header
          collisionPadding={10}
          sticky="always"
          className="z-50 flex flex-col gap-1 p-2 w-[calc(100vw-1.25rem)] sm:w-80 text-black bg-white rounded-pilled shadow-lg"
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
          <DropdownMenu.Item asChild>
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
