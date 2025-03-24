'use client'

import { usePathname } from 'next/navigation'
import React, { HTMLProps } from 'react'
import type { LinkProps } from 'next/link'
import Link from './Link'
import { getCurrentVersion } from '@/utils/getCurrentVersion'

export const VersionedLink = ({
  prefetch = false,
  href,
  ...rest
}: LinkProps & HTMLProps<HTMLAnchorElement>) => {
  const pathname = usePathname()
  const version = getCurrentVersion(pathname)
  const isInternal = href.startsWith('/')
  const finalHref = version && isInternal ? `/${version}${href}` : href
  return <Link href={finalHref} {...rest} prefetch={prefetch} />
}

export default VersionedLink
