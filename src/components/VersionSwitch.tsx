'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { NavLinkButton } from './ui/NavLinkButton'
import { NavLink } from './NavLink'
import { Tag } from './ui/Tag'
import { getCurrentVersion } from '@/utils/getCurrentVersion'
import { VERSIONS } from '@/utils/constants'
import { getRecentVersion, isExternalVersion } from '@/utils/versioning.client'
import type { VersionData } from '@/types'

const VersionItem = ({ version }: { version: VersionData }) => {
  const isExternal = isExternalVersion(version)
  const isDefaultVersion = useMemo(() => {
    return version.version === getRecentVersion(VERSIONS)?.version
  }, [version])

  const url = useMemo(() => {
    if (isExternal) {
      return version.url
    }

    if (isDefaultVersion) {
      return '/'
    }

    return `/${version.version}`
  }, [version, isExternal, isDefaultVersion])

  return (
    <DropdownMenu.Item asChild>
      <NavLink href={url} target={isExternal ? '_blank' : undefined}>
        {version.version}
        {version.isBeta ? <Tag className="ml-1">Beta</Tag> : null}
      </NavLink>
    </DropdownMenu.Item>
  )
}

export const VersionSwitch = () => {
  const pathname = usePathname()

  const activeItem = useMemo(() => {
    const defaultVersion = getRecentVersion(VERSIONS)?.version ?? '2.x'
    const version = getCurrentVersion(pathname)

    if (!version) {
      return VERSIONS.find((currentVersion) => {
        return currentVersion.version === defaultVersion
      })
    }

    return VERSIONS.find((currentVersion) => {
      return currentVersion.version === version
    })
  }, [pathname])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <NavLinkButton className="text-base p-1">
          {activeItem?.version || 'All versions'}
          <ChevronDownIcon className="w-3 h-3" />
        </NavLinkButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex flex-col gap-6 z-50 py-6 px-2 lg:py-3 text-black bg-white border rounded-lg shadow-md border-grayAlpha-100">
          <div>
            {VERSIONS.map((version) => (
              <VersionItem key={version.version} version={version} />
            ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
