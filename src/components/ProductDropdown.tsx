'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { NavLink } from './NavLink'
import { NavLinkButton } from './ui/NavLinkButton'
import { cn } from '@/utils'
import { PRODUCTS, VERSIONS } from '@/utils/constants'
import { getRecentVersion } from '@/utils/versioning.client'

export const ProductDropdown = ({ prefix = '' }: { prefix?: string }) => {
  const pathname = usePathname()

  const version = prefix ? prefix.split('/')[1] : getRecentVersion(VERSIONS)?.version || null

  const activeItem = useMemo(() => {
    if (!version || !PRODUCTS[version]) {
      return null
    }

    return PRODUCTS[version]
      .filter((option) => {
        if (option.href === '/') {
          return pathname === '/'
        } else {
          const firstPart = option.href.split('/')[1]
          return (
            pathname.startsWith(`${prefix}/${firstPart}`) || pathname === `${prefix}${option.href}`
          )
        }
      })
      .sort((a, b) => {
        if (`${prefix}${a.href}` === pathname) {
          return -1
        }

        return 0
      })
      .at(0)
  }, [pathname, prefix, version])

  if (!version) {
    return null
  }

  const buttonClass = cn('text-base outline-none', !!activeItem ? 'font-semibold' : 'font-normal')

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <NavLinkButton className={buttonClass}>
          {activeItem?.label || 'All docs'}
          <ChevronDownIcon className="w-3 h-3" />
        </NavLinkButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex flex-col gap-6 z-50 py-6 px-2 lg:py-3 text-black bg-white border rounded-lg shadow-md border-grayAlpha-100 w-[14rem] lg:w-[10.43rem]">
          <div>
            <div className="uppercase font-bold leading-[120%] text-xs mb-3 px-2 block lg:hidden">
              Documentations
            </div>
            {PRODUCTS[version].map((option) => (
              <DropdownMenu.Item key={option.href} asChild>
                <NavLink href={`${prefix}${option.href}`}>{option.label}</NavLink>
              </DropdownMenu.Item>
            ))}
          </div>
          <div className="block lg:hidden">
            <div className="uppercase font-bold leading-[120%] text-xs px-2 mb-3 block lg:hidden">
              Others
            </div>
            <NavLink href={`${prefix}/guides`}>Guides</NavLink>
            <NavLink href={`${prefix}/examples`}>Examples</NavLink>
            <NavLink href="https://templates.tiptap.dev" target="_blank">
              Templates
            </NavLink>
            <NavLink href="https://tiptap.dev" target="_blank">
              Website
            </NavLink>
          </div>
          <div className="block lg:hidden">
            <NavLink
              variant="invert"
              href="https://cloud.tiptap.dev/register"
              target="_blank"
              className="items-center justify-center text-center"
              hideIcon
            >
              Sign up
            </NavLink>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
