'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { NavLinkButton } from './ui/NavLinkButton'
import { NavLink } from './NavLink'
import { Tag } from './ui/Tag'
import { VERSIONS, CURRENT_VERSION } from '@/utils/constants'
import type { VersionData } from '@/types'

const getItemLabel = ({ version }: { version: VersionData }) => {
  if (version.isLegacy) return 'Legacy'
  if (version.isBeta) return 'Beta'
  if (version.isAlpha) return 'Alpha'
  if (version.isRc) return 'RC'
  return false
}

const VersionItem = ({ version }: { version: VersionData }) => {
  const label = getItemLabel({ version })
  const isCurrentVersion = version.version === CURRENT_VERSION

  return (
    <DropdownMenu.Item asChild>
      <NavLink href={version.url} target={!isCurrentVersion ? '_blank' : ''} hideIcon>
        {version.version}
        {label ? <Tag className="ml-1">{label}</Tag> : null}
      </NavLink>
    </DropdownMenu.Item>
  )
}

export const VersionSwitch = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <NavLinkButton className="p-1 text-base">
          {CURRENT_VERSION}
          <ChevronDownIcon className="w-3 h-3" />
        </NavLinkButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="version-dropdown-content">
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
