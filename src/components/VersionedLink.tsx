'use client'

import React, { HTMLProps } from 'react'
import type { LinkProps } from 'next/link'
import Link from './Link'
import { useCurrentVersion } from '@/hooks/useCurrentVersion'
import { getRecentVersion } from '@/utils/versioning.client'
import { VERSIONS } from '@/utils/constants'

export const VersionedLink = ({
  prefetch = false,
  href,
  ...rest
}: LinkProps & HTMLProps<HTMLAnchorElement>) => {
  const currentVersion = useCurrentVersion()
  const recentVersion = getRecentVersion(VERSIONS)
  const prefix =
    recentVersion?.version !== currentVersion?.version ? `/${currentVersion?.version}` : ''

  const needsPrefix = !href.startsWith(prefix)

  const isInternal = href.startsWith('/')
  const finalHref = isInternal && needsPrefix ? `${prefix}${href}` : href

  return <Link href={finalHref} {...rest} prefetch={prefetch} />
}

export default VersionedLink
