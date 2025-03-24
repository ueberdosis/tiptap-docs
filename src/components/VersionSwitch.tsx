'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { NavLinkButton } from './ui/NavLinkButton'
import { NavLink } from './NavLink'
import { getCurrentVersion } from '@/utils/getCurrentVersion'

const versions = [
  {
    label: 'V2',
    key: 'v2',
    href: '/',
  },
  {
    label: 'V3',
    key: 'v3',
    href: '/v3',
  },
]

export const VersionSwitch = () => {
  const pathname = usePathname()

  const activeItem = useMemo(() => {
    const version = getCurrentVersion(pathname)

    if (!version) {
      return versions[0]
    }

    return versions.find((currentVersion) => {
      return currentVersion.key === version
    })
  }, [pathname])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <NavLinkButton className="text-base p-1">
          {activeItem?.label || 'All versions'}
          <ChevronDownIcon className="w-3 h-3" />
        </NavLinkButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex flex-col gap-6 z-50 py-6 px-2 lg:py-3 text-black bg-white border rounded-lg shadow-md border-grayAlpha-100">
          <div>
            {versions.map((version) => (
              <DropdownMenu.Item asChild key={version.href}>
                <NavLink href={version.href}>{version.label}</NavLink>
              </DropdownMenu.Item>
            ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
