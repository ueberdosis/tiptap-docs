'use client'

import { getCurrentVersion } from '@/utils/getCurrentVersion'
import { usePathname } from 'next/navigation'
import React, { HTMLProps } from 'react'
import Link from './Link'
import type { LinkProps } from 'next/link'

export const VersionedLink = ({
  prefetch = false,
  href,
  ...rest
}: LinkProps & HTMLProps<HTMLAnchorElement>) => {
  const pathname = usePathname()
  const version = getCurrentVersion(pathname)
  const isInternal = href.startsWith('/')
  const finalHrf = version && isInternal ? `/${version}${href}` : href
  return <Link href={finalHrf} {...rest} prefetch={prefetch} />
}

export default VersionedLink
